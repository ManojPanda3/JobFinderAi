export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote" | string;
  salary: string | null;
  posted: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  application_link: string;
  company_logo: string;
  job_board: string;
}

export let jobs: Job[] = [];


export async function searchJobs(query: string = "", id: string = ""): Promise<Job[]> {
  try {
    const response = await fetch('/api/jobs', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        id,
        limit: 10
      })
    });

    let fetchedJobs = await response.json();
    fetchedJobs = Object.values(fetchedJobs)

    const processedJobs = fetchedJobs.map((job) => {
      let locationString = "Unknown Location";
      if (Array.isArray(job.locations) && job.locations.length > 0) {
        const firstLocation = job.locations[0];
        if (firstLocation && firstLocation.city && firstLocation.region && firstLocation.country) {
          locationString = `${firstLocation.city}, ${firstLocation.region}, ${firstLocation.country}`;
        } else if (firstLocation && firstLocation.city && firstLocation.country) {
          locationString = `${firstLocation.city}, ${firstLocation.country}`;
        }
      } else if (job.location_type) {
        locationString = job.location_type;
      }


      let requirementsArray: string[] = job.job_categories || [];

      // Extract responsibilities from HTML, handle potential errors
      let responsibilitiesArray: string[] = [];
      try {
        if (job.description) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(job.description, "text/html");
          const headers = doc.querySelectorAll("h2");
          // Find the h2 containing "Responsibilities" or similar
          let responsibilitiesHeader: HTMLHeadingElement | null = null;
          for (const header of Array.from(headers)) {
            if (header.textContent?.toLowerCase().includes("responsibilities")) {
              responsibilitiesHeader = header;
              break;
            }
          }
          // Extract list items following the responsibilities header
          if (responsibilitiesHeader) {
            let nextSibling = responsibilitiesHeader.nextElementSibling;
            while (nextSibling) {
              if (nextSibling.tagName === 'UL') {
                const listItems = nextSibling.querySelectorAll('li');
                responsibilitiesArray = Array.from(listItems).map(li => li.textContent || "");
                break; // Stop after the first ul
              }
              nextSibling = nextSibling.nextElementSibling;
            }
          }
        }
      } catch (error) {
        console.error("Error parsing description HTML for responsibilities:", error);
        responsibilitiesArray = [];
      }

      return {
        id: job._id,
        company: job.company_name || "",
        title: job.job_title,
        description: job.description,
        requirements: requirementsArray,
        responsibilities: responsibilitiesArray,
        location: locationString,
        type: job.job_type || "",
        salary: job.salary_range,
        posted: job.date_posted,
        application_link: job.application_link,
        company_logo: job.company_logo,
        job_board: job.job_board,
      };
    });
    return processedJobs; //return the processed jobs array

  } catch (error) {
    console.error('Error fetching jobs data:', error);
    // jobs = []; // Don't modify the global jobs array
    return []; // Return an empty array on error
  }
}

export function fetcheJobs() {
  try {
    // Create a more diverse and realistic set of dummy jobs
    const dummyJobs: Job[] = [
      {
        id: "1",
        title: "Software Engineer",
        company: "Google",
        location: "Bangalore, Karnataka, India",
        type: "Full-time",
        salary: "₹15,00,000 - ₹25,00,000",
        posted: "2024-01-11",
        description: "Join Google's engineering team to build the next generation of search and AI products.  We are looking for talented and passionate software engineers.",
        requirements: ["Java", "Python", "C++", "Experience with distributed systems"],
        responsibilities: ["Design and implement scalable software solutions", "Contribute to open-source projects", "Work with cutting-edge technologies"],
        application_link: "https://careers.google.com/jobs",
        company_logo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png", // Actual Google logo URL
        job_board: "Google Careers"
      },
      {
        id: "2",
        title: "UX Designer",
        company: "Flipkart",
        location: "Bangalore, Karnataka, India",
        type: "Full-time",
        salary: "₹12,00,000 - ₹20,00,000",
        posted: "2024-01-12",
        description: "Flipkart is seeking a creative and user-focused UX Designer to help shape the future of e-commerce in India.",
        requirements: ["Figma", "Sketch", "User Research", "Prototyping", "Interaction Design"],
        responsibilities: ["Conduct user research and testing", "Create wireframes and prototypes", "Collaborate with product and engineering teams"],
        application_link: "https://www.flipkartcareers.com/",
        company_logo: "https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-logo_9bdd20.svg",  // Actual Flipkart logo
        job_board: "Flipkart Careers"
      },
      {
        id: "3",
        title: "Data Scientist",
        company: "Amazon",
        location: "Hyderabad, Telangana, India",
        type: "Full-time",
        salary: "₹18,00,000 - ₹30,00,000",
        posted: "2024-01-13",
        description: "Amazon is looking for a Data Scientist to join our team in Hyderabad.  You will work on challenging problems in areas such as machine learning, recommendation systems, and forecasting.",
        requirements: ["Python", "R", "Machine Learning", "Statistical Modeling", "Data Visualization"],
        responsibilities: ["Develop and deploy machine learning models", "Analyze large datasets", "Communicate insights to stakeholders"],
        application_link: "https://www.amazon.jobs/en/",
        company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png", // Amazon Logo
        job_board: "Amazon Jobs"
      },
      {
        id: "4",
        title: "Frontend Developer",
        company: "Microsoft",
        location: "Hyderabad, Telangana, India",
        type: "Full-time",
        salary: "₹14,00,000 - ₹22,00,000",
        posted: "2024-01-14",
        description: "Microsoft is hiring Frontend Developers to build innovative and user-friendly web applications.",
        requirements: ["JavaScript", "React", "HTML", "CSS", "Experience with responsive design"],
        responsibilities: ["Develop and maintain web applications", "Collaborate with designers and backend engineers", "Write clean and maintainable code"],
        application_link: "https://careers.microsoft.com/us/en",
        company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png", //Microsoft Logo
        job_board: "Microsoft Careers"
      },
      {
        id: "5",
        title: "Product Manager",
        company: "Swiggy",
        location: "Bangalore, Karnataka, India",
        type: "Full-time",
        salary: "₹20,00,000 - ₹35,00,000",
        posted: "2024-01-15",
        description: "Swiggy is looking for a Product Manager to lead the development of new features and products for our food delivery platform.",
        requirements: ["Product Strategy", "Market Research", "Agile Development", "Data Analysis", "Communication Skills"],
        responsibilities: ["Define and prioritize product requirements", "Work with engineering and design teams", "Launch and iterate on new products"],
        application_link: "https://careers.swiggy.com/",
        company_logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Swiggy_logo.svg/2560px-Swiggy_logo.svg.png", // Swiggy Logo
        job_board: "Swiggy Careers"
      },
      {
        id: "6",
        title: "Graphic Designer",
        company: "Myntra",
        location: "Bangalore, Karnataka, India",
        type: "Full-time",
        salary: "₹8,00,000 - ₹14,00,000",
        posted: "2024-01-16",
        description: "Myntra is hiring a talented Graphic Designer to create visually appealing designs for our marketing campaigns and website.",
        requirements: ["Adobe Creative Suite", "Typography", "Branding", "Illustration", "Web Design"],
        responsibilities: ["Create marketing materials", "Design website layouts", "Maintain brand consistency"],
        application_link: "https://careers.myntra.com/",
        company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Myntra_logo.svg/2560px-Myntra_logo.svg.png",  //myntra logo
        job_board: "Myntra Careers"
      },
      {
        id: "7",
        title: "DevOps Engineer",
        company: "Infosys",
        location: "Pune, Maharashtra, India",
        type: "Full-time",
        salary: "₹10,00,000 - ₹18,00,000",
        posted: "2024-01-17",
        description: "Infosys is seeking a DevOps Engineer to help automate and streamline our software development and deployment processes.",
        requirements: ["AWS", "Azure", "Docker", "Kubernetes", "Jenkins", "CI/CD"],
        responsibilities: ["Automate build and deployment pipelines", "Manage cloud infrastructure", "Monitor system performance"],
        application_link: "https://www.infosys.com/careers.html",
        company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/2560px-Infosys_logo.svg.png", //Infosys Logo
        job_board: "Infosys Careers"
      },
      {
        id: "8",
        title: "Full Stack Developer",
        company: "TCS",
        location: "Chennai, Tamil Nadu, India",
        type: "Full-time",
        salary: "₹9,00,000 - ₹16,00,000",
        posted: "2024-01-18",
        description: "Tata Consultancy Services (TCS) is seeking a Full Stack Developer.",
        requirements: ["JavaScript", "Node.js", "React", "Angular", "MongoDB", "SQL"],
        responsibilities: ["Develop and maintain web and mobile applications.", "Write efficient and well-documented code.", "Collaborate on technical design and implementation."],
        application_link: "https://www.tcs.com/careers",
        company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/2560px-Tata_Consultancy_Services_Logo.svg.png",  // TCS logo
        job_board: "TCS Careers"
      },
      {
        id: "9",
        title: "Business Analyst",
        company: "Accenture",
        location: "Mumbai, Maharashtra, India",
        type: "Full-time",
        salary: "₹11,00,000 - ₹19,00,000",
        posted: "2024-01-19",
        description: "Accenture is looking for a Business Analyst to bridge the gap between business needs and technical solutions.",
        requirements: ["Requirements Gathering", "Process Modeling", "Data Analysis", "Communication Skills", "Stakeholder Management"],
        responsibilities: ["Gather and analyze business requirements", "Create functional specifications", "Work with development teams"],
        application_link: "https://www.accenture.com/in-en/careers",
        company_logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",  // Accenture logo
        job_board: "Accenture Careers"
      },
      {
        id: "10",
        title: "UI/UX Researcher",
        company: "Adobe",
        location: "Noida, Uttar Pradesh, India",
        type: "Full-time",
        salary: "₹13,00,000 - ₹21,00,000",
        posted: "2024-01-20",
        description: "Adobe is seeking a UI/UX Researcher to conduct user research and inform the design of our products.",
        requirements: ["User Research Methods", "Usability Testing", "Survey Design", "Data Analysis", "Communication Skills"],
        responsibilities: ["Plan and conduct user research studies", "Analyze user behavior and feedback", "Present research findings to stakeholders"],
        application_link: "https://www.adobe.com/careers.html",
        company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adobe_Systems_logo_and_wordmark.svg/2560px-Adobe_Systems_logo_and_wordmark.svg.png", //adobe logo
        job_board: "Adobe Careers"
      }

    ];

    return dummyJobs;  // Return the dummy data

  } catch (error) {
    console.error('Error fetching jobs data:', error);
    // jobs = []; // Don't update the global jobs array here.
    return []; // Return an empty array
  }
}
