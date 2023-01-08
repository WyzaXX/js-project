// Get the form elements
const form = document.querySelector("form");
const keywordInput = document.querySelector('input[name="keywords"]');
const locationInput = document.querySelector('input[name="location"]');
const partTimeCheckbox = document.querySelector('input[name="part-time"]');
const fullTimeCheckbox = document.querySelector('input[name="full-time"]');

// Get the results container element
const resultsContainer = document.querySelector(".results");

// Fetch the job data from the file
fetch("job-data.json")
  .then((response) => response.json())
  .then((jobs) => {
    // Display all jobs when the page is loaded or refreshed
    displayJobs(jobs);
  });

// Add a submit event listener to the form
form.addEventListener("submit", (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the keyword and location values
  const keywords = keywordInput.value.trim();
  const location = locationInput.value.trim();

  // Fetch the job data from the file
  fetch("job-data.json")
    .then((response) => response.json())
    .then((jobs) => {
      let filteredJobs;

      // If the keyword and location values are empty, display all jobs
      if (keywords === "" && location === "") {
        filteredJobs = jobs;
      } else if (keywords === "") {
        // Filter the jobs based on the location value only
        filteredJobs = jobs.filter((job) => {
          return job.location.toLowerCase().includes(location.toLowerCase());
        });
      } else if (location === "") {
        // Filter the jobs based on the keyword value and company name
        filteredJobs = jobs.filter((job) => {
          return (
            job.title.toLowerCase().includes(keywords.toLowerCase()) ||
            job.company.toLowerCase().includes(keywords.toLowerCase())
          );
        });
      } else {
        // Filter the jobs based on the keyword and location values
        filteredJobs = jobs.filter((job) => {
          return (
            (job.title.toLowerCase().includes(keywords.toLowerCase()) &&
              job.location.toLowerCase().includes(location.toLowerCase())) ||
            job.company.toLowerCase().includes(keywords.toLowerCase())
          );
        });
      }

      // If both type checkboxes are checked, display all jobs
      if (partTimeCheckbox.checked && fullTimeCheckbox.checked) {
        displayJobs(filteredJobs);
      } else if (partTimeCheckbox.checked) {
        // Otherwise, filter the jobs based on the selected type
        const partTimeJobs = filteredJobs.filter(
          (job) => job.type === "Part-Time"
        );
        displayJobs(partTimeJobs);
      } else if (fullTimeCheckbox.checked) {
        const fullTimeJobs = filteredJobs.filter(
          (job) => job.type === "Full-Time"
        );
        displayJobs(fullTimeJobs);
      }
    });
});

// Display the jobs on the page
function displayJobs(jobs) {
  // Clear the previous results
  resultsContainer.innerHTML = "";

  // Iterate over the jobs and create an HTML element for each job
  jobs.forEach((job) => {
    // Create the job element
    const jobElement = document.createElement("div");
    jobElement.classList.add("job");

    // Create the title element
    const titleElement = document.createElement("h3");
    titleElement.textContent = job.title;
    jobElement.appendChild(titleElement);

    // Create the company element
    const companyElement = document.createElement("p");
    companyElement.textContent = job.company;
    jobElement.appendChild(companyElement);

    // Create the location element
    const locationElement = document.createElement("p");
    locationElement.textContent = `Location: ${job.location}`;
    jobElement.appendChild(locationElement);

    // Create the type element
    const typeElement = document.createElement("p");
    typeElement.textContent = job.type;
    jobElement.appendChild(typeElement);

    // Create the apply button element
    const applyButton = document.createElement("a");
    applyButton.href = job.apply_url;
    applyButton.textContent = "Apply Now";
    jobElement.appendChild(applyButton);

    // Add the job element to the results container
    resultsContainer.appendChild(jobElement);
  });
}
