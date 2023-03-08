const wrongPageWrapper = document.querySelector(".wrong-page-wrapper");
const contentWrapper = document.querySelector(".content-wrapper");

const recruitmentMessage = document.querySelector(".recruitment-message");

const generateButton = document.querySelector(".generate-button");

const optionToneProfessional = document.querySelector(".professional");
const optionToneCordial = document.querySelector(".cordial");

const ALLOWED_URL = "www.linkedin.com/";

const defaultOptions = {
  tone: "professional",
  additionalInformation: [],
};

const CATEGORIES = {
  TONE: "tone",
  ADDITIONAL_INFORMATION: "additionalInformation",
};

const options = defaultOptions;

generateButton.addEventListener("click", async () => {
  console.log("Generating response with the following options", options);
  const prompt = `Please provide a response to this recruitment message with a ${
    options.tone
  } tone ${
    options.additionalInformation.length > 0
      ? `and ask for the following additional information: ${options.additionalInformation.join(
          ", "
        )}`
      : ""
  }: \n\n"${recruitmentMessage.value}"`;

  // console.log("Prompt", prompt);
  const response = await fetch("https://recruit-wizard.vercel.app/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  let answer = await response.json();

  console.log("Answer", answer);
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  tabId = tabs[0].id;

  console.log("Loading", tabs[0].url);

  if (!tabs[0].url?.includes(ALLOWED_URL)) {
    console.log("Wrong page");
    contentWrapper.style.display = "none";
    wrongPageWrapper.style.display = "inline-block";
    return;
  }

  console.log("Displaying it all");

  contentWrapper.style.display = "inline-block";
  wrongPageWrapper.style.display = "none";

  chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"],
  });
});

const handleAdditionalInformationClick = (
  additionalInformationOptions,
  index
) => {
  const optionName = additionalInformationOptions[index].innerText;
  const isSelected =
    additionalInformationOptions[index].dataset.selected === "true";
  console.log("Clicked on", optionName);
  console.log("is selected", isSelected);

  if (isSelected) {
    additionalInformationOptions[index].dataset.selected = "false";

    const indexToRemove = options[CATEGORIES.ADDITIONAL_INFORMATION].findIndex(
      (value) => value === optionName
    );
    options[CATEGORIES.ADDITIONAL_INFORMATION].splice(indexToRemove, 1);
  } else {
    options[CATEGORIES.ADDITIONAL_INFORMATION].push(optionName);
    additionalInformationOptions[index].dataset.selected = "true";
  }
};

const handleToneClick = (e, tone) => {
  const element = e.target;
  const isSelected = element.dataset.selected === "true";

  if (isSelected) {
    element.dataset.selected = "false";
  } else {
    element.dataset.selected = "true";
  }

  if (tone === "professional") {
    optionToneCordial.dataset.selected = "false";
  } else {
    optionToneProfessional.dataset.selected = "false";
  }

  if (!isSelected) {
    options[CATEGORIES.TONE] = tone;
  } else {
    options[CATEGORIES.TONE] = "";
  }
};

const setupListeners = () => {
  const additionalInformationOptions = document.querySelectorAll(
    ".additional-information"
  );
  console.log("optionAdditionalInformation", additionalInformationOptions);
  const options = [...additionalInformationOptions];

  // nodeArray.forEach((type, index) => {
  //   type.addEventListener("click", () => handleOptionClick(typeOptions, index));
  // });

  optionToneProfessional.addEventListener("click", (e) =>
    handleToneClick(e, "professional")
  );
  optionToneCordial.addEventListener("click", (e) =>
    handleToneClick(e, "cordial")
  );

  options.forEach((option, index) => {
    option.addEventListener("click", () =>
      handleAdditionalInformationClick(additionalInformationOptions, index)
    );
  });
};

setupListeners();
