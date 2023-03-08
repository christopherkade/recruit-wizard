const wrongPageWrapper = document.querySelector(".wrong-page-wrapper");
const contentWrapper = document.querySelector(".content-wrapper");

const recruitmentMessage = document.querySelector(".recruitment-message");

const generateButton = document.querySelector(".generate-button");

const optionToneProfessional = document.querySelector(".professional");
const optionToneCordial = document.querySelector(".cordial");

const generateReponseLabel = document.querySelector(".generate-response-label");
const generatingResponseLabel = document.querySelector(
  ".generating-response-label"
);
const generatedResponseLabel = document.querySelector(
  ".generated-response-label"
);

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
  if (recruitmentMessage.value.length === 0) {
    recruitmentMessage.style.border = "1px solid red";
    return;
  } else {
    recruitmentMessage.style.border = "initial";
    generatingResponseLabel.style.display = "inline-block";
    generateReponseLabel.style.display = "none";
    generatedResponseLabel.style.display = "none";
  }

  const prompt = `Please provide a response to this recruitment message with a ${
    options.tone
  } tone ${
    options.additionalInformation.length > 0
      ? `and ask for the following additional information: ${options.additionalInformation.join(
          ", "
        )}`
      : ""
  }: \n\n"${recruitmentMessage.value}"`;

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

  generatingResponseLabel.style.display = "none";
  generatedResponseLabel.style.display = "inline-block";
  navigator.clipboard.writeText(answer.bot);
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  tabId = tabs[0].id;

  if (!tabs[0].url?.includes(ALLOWED_URL)) {
    contentWrapper.style.display = "none";
    wrongPageWrapper.style.display = "inline-block";
    return;
  }

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
  const options = [...additionalInformationOptions];

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
