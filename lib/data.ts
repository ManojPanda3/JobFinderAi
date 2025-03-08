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

    jobs = fetchedJobs.map((job) => {
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


      let requirementsArray: string[] = [];
      try {
        if (job.description) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(job.description, "text/html");
          const listItems = doc.querySelectorAll("ul > li"); // Select direct children of ul
          requirementsArray = Array.from(listItems).map((li) => li.textContent || "");
          //if can't find from html , uses job_categories
          if (requirementsArray.length === 0 && job.job_categories) requirementsArray = job.job_categories
        }
      } catch (error) {
        console.error("Error parsing description HTML:", error);
        // Fallback to job_categories if HTML parsing fails, or set to empty array
        requirementsArray = job.job_categories || [];
      }

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
    return jobs; //return the job array

  } catch (error) {
    console.error('Error fetching jobs data:', error);
    jobs = [];
    return [];
  }
}

export async function fetcheJobs() {
  try {
    const response = await fetch(`https://data.hirebase.org/v0/jobs`);

    if (!response.ok) {
      const errorText = await response.text();
      jobs = []
    }

    let fetchedJobs = await response.json();
    fetchedJobs = Object.values(fetchedJobs)
    console.log(fetchedJobs)

    // if (!fetchedJobs || !fetchedJobs.length) {
    //   throw new Error(`Expected an array of jobs, but got: ${typeof fetchedJobs}`);
    // }

    jobs = fetchedJobs.map((job) => {
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

      let requirementsArray: string[] = [];
      requirementsArray = job.job_categories

      let responsibilitiesArray: string[] = job.industries;

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
    return jobs;

  } catch (error) {
    console.error('Error fetching jobs data:', error);
    jobs = [];
    return [];
  }
}
