//https://www.youtube.com/watch?v=JXi9C2EQ2qE&ab_channel=FrameworkTelevision
//https://www.youtube.com/watch?v=aFelEcWBqII&t=21s&ab_channel=CodingShiksha
//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
//https://developers.google.com/maps/documentation/javascript/places
//http://jsfiddle.net/2crQ7/
//https://developers.google.com/maps/documentation/javascript
var map = null;
var currentInfoWindow = null;
window.initMap = initMap;
function initMap() {
  // Try HTML5 geolocation.
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 28.3772, lng: -81.563873 },
    zoom: 13,
  });
  infoWindow = new google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos);
        currentInfoWindow = infoWindow;
        currentInfoWindow.setPosition(pos);
        currentInfoWindow.setContent("Location found.");
        currentInfoWindow.open(map);
        getRestaurants(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
function getRestaurants(pos) {
  var myLocation = new google.maps.LatLng(pos.lat, pos.lng);
  var request = {
    location: myLocation,
    radius: 500,
    query: ["grocery store near me"],
  };
  var service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      //let price = createPrice(place.price_level);
      let addressComponents = place.formatted_address.split(",");
      let streetAddress = addressComponents[0];
      let cityState = addressComponents[1] + ", " + addressComponents[2];
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      let mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
      let contentString = `
      <h3 class="infoWindowText"><strong>${place.name}</strong></h3>
      <h4 class="infoWindowText">${streetAddress}<br>${cityState}</h4>
      <a href="${mapUrl}" id="mapLink" class="infoWindowText" target="_blank">View on Google Maps</a>
      `;
      // <p>${price}<br/>;
      //Rating : ${place.rating}
      //createMarker(results[i]);
      var infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
      var marker = new google.maps.Marker({
        map,
        animation: google.maps.Animation.DROP,
        position: place.geometry.location,
        title: place.name,
      });
      google.maps.event.addListener(
        marker,
        "click",
        (function (marker, contentString, infowindow) {
          return function () {
            if (currentInfoWindow != null) {
              currentInfoWindow.close();
            }
            infowindow.open(map, marker);
            currentInfoWindow = infowindow;
          };
        })(marker, contentString, infowindow)
      );
    }
  }
}
function addToLocalStorage(card, type) {
  let currentItems = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
  if (currentItems.some((obj) => obj.id === card)) return;
  currentItems.push({ id: card, type: type });
  localStorage.setItem("items", JSON.stringify(currentItems));
}
async function openModal(header, img, id) {
  data = await spoonacularApp.apiCall(`food/products/${id}`, "", {
    "Content-Type": "application/json",
  });
  var modalContainer = $(".list-disc");
  modalContainer.empty();
  modal.style.display = "flex";
  document.getElementById("modal").classList.add("active");
  document.getElementById("modal-img").src = img;
  document.getElementById("modal-header").innerHTML = header;
  for (let i = 0; i < data.importantBadges.length; i++) {
    let item = data.importantBadges[i].replace(/_/g, " ");
    $(".list-disc").append("<li>" + item + "</li>");
  }
}
function closeModal() {
  document.getElementById("modal").classList.remove("active");
  modal.style.display = "none";
}

const spoonacularApp = {
  //initiate app
  init: () => {
    $("#byIngredientsForm").submit((event) => {
      event.preventDefault();
      spoonacularApp.validateByIngredients();
    });
    $("#searchGroceryProductForm").submit((event) => {
      event.preventDefault();
      spoonacularApp.validateGroceryProduct();
    });
  },
  apiCall: (userRequest, queries, options) => {
    const apikey = "?apiKey=c43e85f3c2a64849b63ec8539234f19c";
    var url = `https://api.spoonacular.com/${userRequest}${apikey}${queries}`;
    return fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        spoonacularApp.success(data);
        return data;
      })
      .catch((error) => {
        spoonacularApp.fail(error);
      });
  },
  success: (data) => {
    // console.log(data);
  },
  fail: (error) => {
    console.log(error);
    console.log("you have an error");
  },

  validateByIngredients: () => {
    var recipeArray = $("#byIngredientsInput").val().split(",");
    var recipeString = recipeArray[0];
    for (let index = 1; index < recipeArray.length; index++) {
      recipeString = recipeString + ",+" + recipeArray[index].trim();
    }
    spoonacularApp.searchByIngredient(recipeString);
  },
  searchByIngredient: async (queries) => {
    var data = await spoonacularApp.apiCall(
      "recipes/findByIngredients",
      "&ingredients=" + queries,
      {
        "Content-Type": "application/json",
      }
    );
    $("#byIngredientsInput").val("");
    spoonacularApp.showByIngredient(data);
  },
  searchRecipeCard: async (id) => {
    const apikey = "?apiKey=c43e85f3c2a64849b63ec8539234f19c";
    var url = `https://api.spoonacular.com/recipes/${id}/card${apikey}`;
    return fetch(url, { "Content-Type": "application/json" })
      .then((response) => response.json())
      .then((data) => {
        spoonacularApp.success(data);
        let url = data.url;
        window.open(url, "_blank");
      })
      .catch((error) => {
        spoonacularApp.fail(error);
      });
  },
  showByIngredient: (data) => {
    var searchContainer = $("#searchResults");
    searchContainer.empty();
    for (let index = 0; index < 9; index += 1) {
      var image = data[index].image;
      var title = data[index].title;
      var id = data[index].id;
      anchorEl = $("<a>");
      var temp = `
      <div class="flex flex-col bg-gradient-to-r from-white to-gray-500 border border-black p-4 mx-6 md:mx-auto">
        <img
        src="${image}"
        class="mx-auto w-auto h-auto max-h-300"
        alt="Image"
        />
        <h4 class="text-xl lg:text-xl md:text-md sm:text-md font-bold mt-4">${title.replace(
          /'/g,
          "\\'"
        )}</h4>
        <div class="my-auto mb-0">
          <button
          class="bg-gray-800 text-white p-2 mt-4 rounded-lg active:scale-95 active:bg-gray-600 transition-transform duration-90"
          onclick='addToLocalStorage("${id}","recipe")'
          >Add</button>
          <button
          class="bg-gray-800 text-white p-2 mt-4 rounded-lg active:scale-95 active:bg-gray-600 transition-transform duration-90"
          onclick='spoonacularApp.searchRecipeCard("${id}")'
          >Recipe</button>
        </div>
      </div>`;
      searchContainer.append(temp);
    }
  },
  validateGroceryProduct: () => {
    var recipeArray = $("#searchGroceryProductInput").val().split(",");
    var recipeString = recipeArray[0];
    for (let index = 1; index < recipeArray.length; index++) {
      recipeString = recipeString + ",+" + recipeArray[index].trim();
    }
    //console.log(recipeString);
    spoonacularApp.searchGroceryProduct(recipeString);
  },
  searchGroceryProduct: async (queries) => {
    var data = await spoonacularApp.apiCall(
      "food/products/search",
      "&query=" + queries,
      {
        method: "GET",
        "Content-Type": "application/json",
      }
    );
    $("#searchGroceryProductInput").val("");
    spoonacularApp.showGroceryProducts(data);
  },
  showGroceryProducts: (data) => {
    var searchContainer = $("#searchResults");
    searchContainer.empty();
    spoonacularApp.generateGroceryModal();
    for (let index = 0; index < 9; index += 1) {
      var image = data.products[index].image;
      var title = data.products[index].title;
      var id = data.products[index].id;
      anchorEl = $("<a>");
      var temp = `
      <div class="flex flex-col bg-gradient-to-r from-white to-gray-500 border border-black p-4 mx-6 md:mx-auto">
      <img
        src="${image}"
        class="mx-auto w-auto h-auto max-h-300"
        alt="Image"
      />
      <h4 class="text-xl lg:text-xl md:text-md sm:text-md font-bold mt-4">${title}</h4>
      <div class="my-auto mb-0">
      <button
        class="bg-gray-800 text-white p-2 mt-4 rounded-lg active:scale-95 active:bg-gray-600 transition-transform duration-90"
        onclick='addToLocalStorage("${id}","product")'
      >
        Add
      </button>
      <button
        class="bg-gray-800 text-white p-2 mt-4 rounded-lg active:scale-95 active:bg-gray-600 transition-transform duration-90"
        onclick="openModal('${title.replace(
          /'/g,
          "\\'"
        )}', '${image}', '${id}')"
      >
        Details
      </button>
      </div>
    </div>`;
      searchContainer.append(temp);
    }
  },

  generateGroceryModal: (data) => {
    var modalContainer = $("#modal");
    modalContainer.empty();
    var temp = `
    <div class="modal-overlay bg-black opacity-75"></div>
      <div class="modal-container bg-gradient-to-r from-white to-gray-400 p-4 md:w-1/2 lg:w-1/3 mx-auto">
        <img id="modal-img" src="" class="h-64 mx-auto" alt="Image" />
        <h4 id="modal-header" class="text-xl font-bold mt-4"></h4>
        <ul class="list-disc pl-5 mt-4">
        </ul>
        <button
          class="modal-close-button bg-gray-800 text-white p-2 mt-4 rounded-lg"
          onclick="closeModal()"
        >
          Close
        </button>
      </div>
    `;
    modalContainer.append(temp);
  },
};

spoonacularApp.init();
