function getEmptyMainBox(key) {
  return `<div class="main-box" accesskey="` + key + `" id="card`+key+`">
    <div id="main">
      <a onclick="deleteCard(event)" data-toggle="tooltip" title="Delete" id = "trash" class="btn btn-info btn-lg">
        <span class="glyphicon glyphicon-trash"></span>
      </a>
      <a onclick="copyToClipboard(event)" data-toggle="tooltip" title="Copy" class="btn btn-info btn-lg">
        <span class="glyphicon glyphicon-copy"></span>
      </a>
      <a onclick="saveCard(event)" data-toggle = "tooltip" title="Save information" class="btn btn-info btn-lg">
        <span class="glyphicon glyphicon-duplicate"></span>
      </a>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <center>
        <div id="input_field">
          <input id = "category-`+ key + `" class="text-line" type length="10" placeholder = "Category"/>
          <br />
          <br />
          <br />
          <input id="category-detail-`+ key + `" class="text-line" type length="10" placeholder = "Detail of the Category"/>
        </div>
      </center>
    </div>
  </div>`
}

function getMainBox(category, details, key) {
  return `<div class="main-box" accesskey="` + key + `"  id="card`+key+`">
    <div id="main">
      <a onclick="deleteCard(event)" data-toggle="tooltip" title="Delete" id = "trash" class="btn btn-info btn-lg">
        <span class="glyphicon glyphicon-trash"></span>
      </a>
      <a onclick="copyToClipboard(event)" data-toggle="tooltip" title="Copy" class="btn btn-info btn-lg">
        <span class="glyphicon glyphicon-copy"></span>
      </a>
      <a onclick="saveCard(event)" data-toggle = "tooltip" title="Save information" class="btn btn-info btn-lg">
        <span class="glyphicon glyphicon-duplicate"></span>
      </a>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <center>
        <div id="input_field">
          <input id = "category-`+ key + `" class="text-line" type length="10" value="` + category + `" placeholder = "Category"/>
          <br />
          <br />
          <br />
          <input id = "category-detail-`+ key + `" class="text-line" type length="10" value="` + details + `" placeholder = "Detail of the Category"/>
        </div>
      </center>
    </div>
  </div>`
}
var count = 0;
var finalData = {};
function placeCards(userId) {
  var data = {};
  axios.get("http://localhost:8081/getUserData/" + userId)
    .then(function (response) {
      // console.log(response);
      if (response.data.hasOwnProperty('Item')) {
        var cardData = JSON.parse(response.data.Item.cardData);
        finalData = cardData;
        Object.keys(cardData).forEach(function (key) {
          count++;
          $("#main-data").append(getMainBox(key, cardData[key], count));
        })
      }

    })
    .catch(function (error) {
      data = {}
    });

}

function saveCardToDatabase(data) {
  // send a POST request
  axios({
    method: 'post',
    url: "http://localhost:8081/saveUserData/",
    data: {
      userId:userId,
      cardData: JSON.stringify(data)
    }
  });
  // console.log("successfully saved")
}

function addEmptyBlock() {
  count++;
  $("#main-data").append(getEmptyMainBox(count));
}

function saveCard(event) {
  try{
    // console.log(event);
    var key = event.path[2].accessKey||event.path[3].accessKey;
    var category = $("#category-" + key).val();
    var categoryDetail = $("#category-detail-" + key).val();
    // console.log(categoryDetail);
    // console.log(category);
    finalData[category] = categoryDetail;
    // console.log(finalData);
    saveCardToDatabase(finalData);
  }catch(e){
    console.log(e);
  }
  
}

function deleteCard(event){
  try{
    // console.log(event);
    var key = event.path[2].accessKey||event.path[3].accessKey;
    var category = $("#category-" + key).val();
    // console.log(category);
    delete finalData[category];
    // console.log(finalData);
    var myobj = document.getElementById("card"+key);
    myobj.remove();
    saveCardToDatabase(finalData);
  }catch(e){
    console.log(e);
  }
}

var userId = $("#userId").val();
// console.log(userId);
placeCards(userId);

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
})



function copyToClipboard(event) {
  var key = event.path[2].accessKey||event.path[3].accessKey;
  // console.log(key);
  
  var copyText = document.getElementById("category-detail-" + key);  
  // console.log(copyText);
  copyText.select();
  // copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}

// console.log(11111)