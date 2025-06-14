document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".search-form");
  const resultsContainer = document.querySelector(".results");
  let jobs = [];

  async function fetchJobs() {
    try {
      const response = await fetch("/data/job-data.json");
      jobs = await response.json();
      displayJobs(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      resultsContainer.innerHTML =
        '<p class="no-jobs-message">Error loading jobs. Please try again later.</p>';
    }
  }

  function formatSalary(salary) {
    if (!salary) return "Salary not specified";

    if (salary.includes("-")) {
      const [min, max] = salary.split("-").map((s) => s.trim());
      return `$${min} - $${max}`;
    }

    return `$${salary}`;
  }

  function displayJobs(jobsToDisplay) {
    if (jobsToDisplay.length === 0) {
      resultsContainer.innerHTML =
        '<p class="no-jobs-message">No jobs found matching your criteria.</p>';
      return;
    }

    resultsContainer.innerHTML = jobsToDisplay
      .map(
        (job) => `
      <div class="job">
        <h3>${job.title}</h3>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Type:</strong> ${job.type}</p>
        <div class="salary">${formatSalary(job.salary)}</div>
        <a href="${
          job.applyUrl
        }" target="_blank" rel="noopener noreferrer">Apply Now</a>
      </div>
    `
      )
      .join("");
  }

  function filterJobs(keywords, location, partTime, fullTime) {
    return jobs.filter((job) => {
      const matchesKeywords =
        !keywords ||
        job.title.toLowerCase().includes(keywords.toLowerCase()) ||
        job.company.toLowerCase().includes(keywords.toLowerCase()) ||
        job.description?.toLowerCase().includes(keywords.toLowerCase());

      const matchesLocation =
        !location ||
        job.location.toLowerCase().includes(location.toLowerCase());

      const matchesType =
        (partTime && job.type.toLowerCase().includes("part-time")) ||
        (fullTime && job.type.toLowerCase().includes("full-time"));

      return matchesKeywords && matchesLocation && matchesType;
    });
  }

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const keywords = document.getElementById("keywords").value;
    const location = document.getElementById("location").value;
    const partTime = document.querySelector('input[name="part-time"]').checked;
    const fullTime = document.querySelector('input[name="full-time"]').checked;

    const filteredJobs = filterJobs(keywords, location, partTime, fullTime);
    displayJobs(filteredJobs);
  });

  fetchJobs();
});
