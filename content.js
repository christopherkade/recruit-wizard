{
  const sendReponseMessage = (deckList) => {
    if (!deckList) return;

    chrome.runtime.sendMessage({
      type: "deck-list-message",
      data: deckList,
    });
  };

  const getDeckListFromDom = (store = CARDMARKET, showSet = false) => {
    // const deckFormat = document
    //   .querySelector(".deck-preview-top-info")
    //   ?.firstChild.innerHTML.split(":")[1]
    //   .trim();
    // const cardData = document.querySelectorAll(".card-controller-inner");
    // let deckList = "";

    // cardData.forEach((data) => {
    //   const cardTitle = data.firstChild.title;
    //   const cardFormat = cardTitle.split("/")[0];
    //   const parsedFormat = parseCardFormat(deckFormat, cardFormat);
    //   let name = cardTitle.split(/:(.*)/s)[1].trim();
    //   const cleanName = name;
    //   const number = data.lastChild.innerText;

    //   if (store === CARDMARKET) {
    //     name = `${name.concat(` [${parsedFormat} Format]`)}`;
    //   } else if (store === TCGPLAYER) {
    //     name = name.replaceAll("'", '"');

    //     if (showSet) {
    //       name = name.concat(` [${cardFormat}]`);
    //     }
    //   }

    //   deckList = deckList.concat(
    //     `<span class="card-name" data-title="${cleanName}">${number} ${name}</span>`
    //   );
    // });

    sendDeckListMessage(deckList);
  };

  chrome.runtime.onMessage.addListener((message) => {
    const { type, data } = message;

    if (type === "store-change") {
      getDeckListFromDom(data);
    } else if (type === "show-set") {
      getDeckListFromDom(data.store, data.checked);
    }
  });

  // On launch, get the user's saved store and generate the card list
  // chrome.storage.sync.get("store", function ({ store }) {
  //   getDeckListFromDom(store);
  // });
}
