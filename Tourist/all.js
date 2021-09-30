const selectDistrict = document.querySelector(".header_select-district");
const popularSectionBtn = document.querySelectorAll(".popular-section_btn");
const spotTitle = document.querySelector(".spot-section_title");
const spotList = document.querySelector(".spot-section_list");
const pagination_element = document.getElementById("pagination");
let data;
let district;
let getDistrict

//axios
axios
  .get(
    "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json"
  )
  .then(function (response) {
    data = response.data.result.records;
    DisplayInfo(data, spotList, spots, current_page);
    SetupPagination(data, pagination_element, spots);
    showDistrict();
    chooseDistrict();
    popularDistrict();
  });

let current_page = 1;
let spots = 4;

// 資料渲染畫面功能
function DisplayInfo(items, wrapper, sopts_per_page, page) {
  //(data, spotList, spots, current_page);
  wrapper.innerHTML = "";
  page--;
  console.log("displayCurrentPage", page);
  console.log("items", items);
  let start = sopts_per_page * page;
  let end = start + sopts_per_page;
  let paginatedItems = items.slice(start, end);
  console.log("paginatedItems", paginatedItems);
  let str = "";
  for (let i = 0; i < paginatedItems.length; i++) {
    let item = paginatedItems[i];
    if (item.Ticketinfo === "免費參觀") {
      item.Ticketinfo = "免費參觀";
    } else {
      item.Ticketinfo = "門票請洽官網查詢";
    }
    str += `
			<li class="spot-section_item">
				<header class="spot-section_header text-white">
					<img src="${item.Picture1}" alt="">
					<div class="spot-section_headerInfo">
						<h3 class="spot-section_subtitle mb-0">${item.Name}</h3>
						<span class="spot-section_district">${item.Zone}</span>
					</div>
				</header>
				<div class="spot-section_body">
					<ul class="spot-section_body-list">
						<li class="spot-section_schedule">
							<img class="spot-section_schedule-icon" src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_clock.png" alt="">
							<span class="spot-section_schedule-text">${item.Opentime}</span>
						</li>
						<li class="spot-section_address">
							<img class="spot-section_address-icon" src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_pin.png">
							<span class="spot-section_address-text">${item.Add}</span>
						</li>
						<li class="spot-section_contact">
							<img class="spot-section_contact-icon" src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_phone.png">
							<span class="spot-section_contact-text">${item.Tel}</span>
						</li>
					</ul>
					<div class="spot-section_free">
						<img class="spot-section_free-icon" src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_tag.png">
						<span class="spot-section_free-text">${item.Ticketinfo}</span>
					</div>
				</div>
			</li>`;
  }
  wrapper.innerHTML = str;
}

//產生分頁按鈕個數
function SetupPagination(items, wrapper, spots_per_page) {
  //(data, pagination_element, spots, current_page)
  wrapper.innerHTML = "";

  let page_total = Math.ceil(items.length / spots_per_page);
  for (let i = 1; i < page_total + 1; i++) {
    let btn = PaginationButton(items, i, page_total);
    wrapper.appendChild(btn);
  }
}

//分頁按鈕點擊效果及資料呈現
function PaginationButton(items, page, page_total) {
  let current_btn_li = document.createElement("li");
  let current_btn = document.createElement("a");
  current_btn.setAttribute("href", "#");
  current_btn.innerText = page; //按鈕頁數數字呈現
  current_btn_li.appendChild(current_btn);

  if (current_page === page) current_btn.classList.add("active");

  // 頁數點擊事件
  current_btn.addEventListener("click", function () {
    current_page = page;
    DisplayInfo(items, spotList, spots, current_page);

    // 為點到的頁數增加active，前一個點到的移除
    let previous_btn = document.querySelector(".pageNumbers a.active");
    previous_btn.classList.remove("active");
    current_btn.classList.add("active");
  });
  return current_btn_li;
}

//渲染<select>選項
function showDistrict() {
  //把zone取出(有重複)
  let zoneRepeat = [];
  data.forEach((item) => {
    zoneRepeat.push(item.Zone);
  });
  //篩出不重複的zone
  district = zoneRepeat.filter((item, index, arr) => {
    return arr.indexOf(item) === index;
  });
  //寫入<select></select>
  let str = "";
  district.forEach(function (item) {
    let defaultSelect =
      '<option class="" selected disabled>- - 請選擇行政區 - -</option>';
    str += `<option class="district" value="${item}">${item}</option>`;
    selectDistrict.innerHTML = defaultSelect + str;
  });
}

//click請選擇行政區
function chooseDistrict() {
  selectDistrict.addEventListener("change", function (e) {
    e.preventDefault();
    console.log("e.target.value", e.target.value);
    if (e.target.value === "- - 請選擇行政區 - -") {
      spotTitle.innerHTML = "";
    } else {
      spotTitle.innerHTML = e.target.value;
      districtInfo(e.target.value);
    }
  });
}

//熱門行政區
function popularDistrict() {
  popularSectionBtn.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      spotTitle.innerHTML = e.target.textContent;
      districtInfo(e.target.textContent);
    });
  });
}

//讀取行政區資料呈現在網頁
function districtInfo(zone) {
  //從data篩選出行政區item
  getDistrict = data.filter(function (item) {
    return item.Zone === zone; //zone="XX區"
  });
  console.log("getDistrict", getDistrict);
  //將篩選出的item渲染到網頁上
  current_page = 1;
  DisplayInfo(getDistrict, spotList, spots, current_page);
  SetupPagination(getDistrict, pagination_element, spots);
}