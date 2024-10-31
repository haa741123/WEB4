import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
// Supabase 설정
const supabaseUrl = "https://kovzqlclzpduuxejjxwf.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvdnpxbGNsenBkdXV4ZWpqeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg1NTE4NTEsImV4cCI6MjAzNDEyNzg1MX0.A4Vn0QJMKnMe4HAZnT-aEa2r0fL4jHOpKoRHmbls8fQ";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// URL에서 음식점 ID를 추출하는 함수
function getRestaurantIdFromUrl() {
  const path = window.location.pathname;
  const parts = path.split('/');
  return parts[parts.length - 1];
}

// Supabase에서 음식점 정보를 가져오는 함수
async function fetchRestaurantInfo(id) {
  try {
    const { data, error } = await supabase
      .from('corkage')
      .select('id, name, phone, address, description, rating')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('음식점 정보를 가져오는 중 오류 발생:', error);
    return null;
  }
}
      // 나중에 DB로부터 받아올 데이터들....
      const restaurantData = {
        menu: [
          {
            name: "스시",
            description:
              "정통 일본식 스시 세트. 신선한 재료로 만든 최고급 스시를 즐겨보세요.",
            price: "₩30,000",
            image: "/static/img/sushi.jpg",
          },
          {
            name: "사시미",
            description:
              "신선한 회 세트. 최고의 품질로 신선함을 유지한 사시미를 제공합니다.",
            price: "₩35,000",
            image: "/static/img/sashimi.jpg",
          },
          {
            name: "롤",
            description:
              "다양한 재료로 만든 롤. 신선한 재료와 독특한 맛이 특징입니다.",
            price: "₩25,000",
            image: "/static/img/roll.jpg",
          },
          {
            name: "튀김",
            description:
              "바삭한 일본식 튀김. 고소한 맛과 바삭한 식감이 일품입니다.",
            price: "₩20,000",
            image: "/static/img/tempura.jpg",
          },
        ],
        photos: [
          "/static/img/res_sample_img.jpg",
          "/static/img/res_sample_img.jpg",
          "/static/img/res_sample_img.jpg",
        ],
        reviews: [
          {
            rating: 5,
            text: "맛있어요!",
            author: "사용자1",
          },
          {
            rating: 4.5,
            text: "서비스가 매우 좋았습니다.",
            author: "사용자2",
          },
          {
            rating: 4.5,
            text: "다시 가고 싶어요!",
            author: "사용자3",
          },
        ],
      };

      // 메뉴 데이터를 로드하는 함수 (DOM 조작 최적화)
async function loadMenu() {
  try {
    const menuContainer = $("#menu-container");
    let menuItems = "";
    $.each(restaurantData.menu, function (index, item) {
      menuItems += `
        <div class="col-md-6 mb-4">
          <div class="menu-item-card">
            <img src="${item.image}" class="card-img-top" alt="${item.name} 이미지" loading="lazy">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${item.description}</p>
              <p class="card-price">${item.price}</p>
            </div>
          </div>
        </div>
      `;
    });
    menuContainer.append(menuItems);
  } catch (error) {
    console.error('메뉴 로드 중 오류 발생:', error);
    $("#menu-container").html('<p>메뉴를 불러오는 데 실패했습니다.</p>');
  }
}

// 사진 데이터를 로드하는 함수 (DOM 조작 최적화)
async function loadPhotos() {
  try {
    const photosContainer = $("#photos-container");
    let photoItems = "";
    $.each(restaurantData.photos, function (index, photo) {
      photoItems += `
        <div class="photo-card mb-3">
          <img src="${photo}" alt="Dish Image" class="img-fluid rounded" loading="lazy">
        </div>
      `;
    });
    photosContainer.append(photoItems);
  } catch (error) {
    console.error('사진 로드 중 오류 발생:', error);
    $("#photos-container").html('<p>사진을 불러오는 데 실패했습니다.</p>');
  }
}

// 리뷰 데이터를 로드하는 함수 (DOM 조작 최적화)
async function loadReviews() {
  try {
    const reviewsContainer = $("#reviews-container");
    let reviewItems = "";
    $.each(restaurantData.reviews, function (index, review) {
      reviewItems += `
        <div class="review-card mb-3 p-3">
          <div class="d-flex align-items-center mb-2">
            ${'<i class="bi bi-star-fill text-warning"></i>'.repeat(Math.floor(review.rating))}
            ${review.rating % 1 !== 0 ? '<i class="bi bi-star-half text-warning"></i>' : ""}
          </div>
          <p class="review-text">${review.text}</p>
          <small class="text-muted">작성자: ${review.author}</small>
        </div>
      `;
    });
    reviewsContainer.append(reviewItems);
  } catch (error) {
    console.error('리뷰 로드 중 오류 발생:', error);
    $("#reviews-container").html('<p>리뷰를 불러오는 데 실패했습니다.</p>');
  }
}

// 매장 정보를 로드하는 함수 (DOM 조작 최적화)
async function loadStoreInfo() {
  try {
    const restaurantId = getRestaurantIdFromUrl();
    const restaurantInfo = await fetchRestaurantInfo(restaurantId);
  
    if (restaurantInfo) {
      const storeInfoContainer = $("#store-info-container");
      const storeInfoItem = `
        <div class="store-info-card mb-3 p-3">
          <p><strong>주소:</strong> ${restaurantInfo.address || '정보 없음'}</p>
          <p><strong>전화번호:</strong> ${restaurantInfo.phone || '정보 없음'}</p>
          <p><strong>영업시간:</strong> ${restaurantInfo.hours || '정보 없음'}</p>
        </div>
      `;
      storeInfoContainer.empty().append(storeInfoItem);
    } else {
      throw new Error('음식점 정보를 가져오지 못했습니다.');
    }
  } catch (error) {
    console.error('매장 정보 로드 중 오류 발생:', error);
    $("#store-info-container").html('<p>매장 정보를 불러오는 데 실패했습니다.</p>');
  }
}

//불러온 데이터 업데이트
async function loadRestaurantInfo() {
  const restaurantId = getRestaurantIdFromUrl();
  const restaurantInfo = await fetchRestaurantInfo(restaurantId);

  if (restaurantInfo) {
    // 음식점 이름 업데이트
    const nameElement = document.querySelector('.restaurant-name');
    if (nameElement) nameElement.textContent = restaurantInfo.name;


    // 설명 업데이트
    const descriptionElement = document.querySelector('.description');
    if (descriptionElement) descriptionElement.textContent = restaurantInfo.description;

    // 별점 업데이트
    const ratingElement = document.querySelector('.rating');
    if (ratingElement) ratingElement.textContent = restaurantInfo.rating;

    // 주소 정보 업데이트
    const addressElement = document.getElementById('modalAddress');
    if (addressElement) addressElement.textContent = restaurantInfo.address;

    // 전화번호 업데이트
    const phoneLink = document.querySelector('a[href^="tel:"]');
    if (phoneLink) {
      phoneLink.href = `tel:${restaurantInfo.phone}`;
    }
  } else {
    console.error('음식점 정보를 가져오지 못했습니다.');
  }
}
// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', async function() {
  try {
    await loadRestaurantInfo();
    await loadMenu();
    await loadPhotos();
    await loadReviews();
    await loadStoreInfo();
    initializeEventListeners();
    initializeSlider();
  } catch (error) {
    console.error('페이지 로드 중 오류 발생:', error);
    // 사용자에게 전체적인 오류 메시지를 표시할 수 있습니다.
  }
});


// 지도를 초기화하는 함수, 위치 모달이 표시될 때 호출됩니다.
const initializeMap = function () {
  /**
   * 특정 위치에 중심을 둔 Kakao 지도를 초기화하고 마커를 설정합니다.
   */
  const mapOptions = {
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 3,
  };
  const map = new kakao.maps.Map(document.getElementById("map"), mapOptions);

  const marker = new kakao.maps.Marker({
    position: mapOptions.center,
  });
  marker.setMap(map);

  map.relayout();
  map.setCenter(mapOptions.center);
};

// 주어진 주소로 Kakao 지도를 리다이렉트하는 함수
const redirectToKakaoMap = function (address) {
  /**
   * 주어진 주소를 가지고 Kakao 지도 검색 페이지로 브라우저를 리다이렉트합니다.
   * @param {string} address - Kakao 지도에서 검색할 주소.
   */
  const webUrl =
    "https://map.kakao.com/link/search/" + encodeURIComponent(address);
  window.location.href = webUrl;
};

//모달이 열릴 때 데이터를 업데이트하는 함수
function updateModalInfo(info) {
  const modalNameElement = document.querySelector('#locationModal .restaurant-name');
  if (modalNameElement) modalNameElement.textContent = info.name;

  const modalAddressElement = document.getElementById('modalAddress');
  if (modalAddressElement) modalAddressElement.textContent = info.address;
}

// 이벤트 리스너를 초기화하는 함수
const initializeEventListeners = function () {
  $(".tab-button").on("click", handleTabButtonClick);
  $("#locationModal").on("shown.bs.modal", function() {
    initializeMap();
    const restaurantId = getRestaurantIdFromUrl();
    fetchRestaurantInfo(restaurantId).then(info => {
      if (info) {
        updateModalInfo(info);
      }
    });
  });
};

// 위치 버튼 클릭 이벤트 핸들러
const handleMapButtonClick = function () {
  /**
   * 위치 버튼 클릭 시 주소를 가져와서 Kakao 지도 페이지로 리다이렉트합니다.
   */
  const address = document.getElementById("modalAddress").textContent;
  redirectToKakaoMap(address);
};

/**
 * 탭 버튼을 클릭했을 때 활성 탭을 전환합니다.
 */
const handleTabButtonClick = function () {
  $(".tab-button").removeClass("active");
  $(".tab-content").removeClass("active");
  $(this).addClass("active");
  const target = $(this).data("target");
  $(target).addClass("active");
};

/**
 * 슬라이더 기능을 초기화하고 터치 이벤트를 설정합니다.
 */
const initializeSlider = function () {
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let currentIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const slider = document.getElementById("slider");

  slider.addEventListener("touchstart", function (event) {
    startX = event.touches[0].clientX;
    prevTranslate = currentTranslate;
  });

  slider.addEventListener("touchmove", function (event) {
    const currentX = event.touches[0].clientX;
    const deltaX = currentX - startX;
    currentTranslate = prevTranslate + deltaX;
    slider.style.transform = `translateX(${currentTranslate}px)`;
  });

  slider.addEventListener("touchend", function () {
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;
    if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

    setPositionByIndex();
  });

  const setPositionByIndex = function () {
    currentTranslate = currentIndex * -window.innerWidth;
    slider.style.transform = `translateX(${currentTranslate}px)`;
  };
};

// 시간을 'HH:mm:ss' 형식으로 변환하는 함수
function convertTo24Hour(timeString) {
  // "HH:mm" 형식인지 확인
  const timePattern = /^\d{2}:\d{2}$/;
  if (timePattern.test(timeString)) {
    // ":00"을 추가하여 "HH:mm:ss" 형식으로 변환
    return timeString + ":00";
  } else {
    console.error("잘못된 시간 형식입니다. 'HH:mm' 형식이어야 합니다.");
    return null;
  }
}

$(document).ready(function () {
  initializeEventListeners();
  initializeSlider();

  // 캘린더 모달이 표시될 때 다시 초기화
  $("#calendarModal").on("shown.bs.modal", function () {
    initializeCustomCalendar();
  });

  $(".submit").on("click", async function () {
    const selectedDateElement = $(".calendar .selected");
    const selectedTimeElement = $(".time-picker .selected");
    const selectedPeople = $("#people").val();

    if (
      !selectedDateElement.length ||
      !selectedTimeElement.length ||
      selectedPeople <= 0
    ) {
      console.error("날짜, 시간, 인원수를 모두 선택해주세요.");
      return;
    }

    const selectedDateText = selectedDateElement.text();
    const selectedTimeText = selectedTimeElement.text();

    // 날짜를 Date 객체로 변환
    const currentYear = new Date().getFullYear(); // 현재 연도 사용
    const formattedDate = `${currentYear}-10-${selectedDateText.padStart(
      2,
      "0"
    )}`;

    // 시간을 'HH:mm:ss' 형식으로 변환
    const formattedTime = convertTo24Hour(selectedTimeText);

    if (!formattedTime) {
      console.error("시간 변환에 실패했습니다.");
      return;
    }

    console.log(
      `예약 정보 - 날짜: ${formattedDate}, 시간: ${formattedTime}, 인원수: ${selectedPeople}`
    );

    // Supabase에 데이터 삽입
    const { data, error } = await supabase.from("reservations").insert([
      {
        reservation_date: formattedDate,
        reservation_time: formattedTime,
        people_count: selectedPeople,
      },
    ]);

    if (error) {
      console.error("예약 중 에러 발생 다시 시도해주세요:", error);
      alert("예약 중 에러가 발생했습니다. 다시 시도해주세요.");
    } else {
      console.log("예약 완료!:", data);
      alert("예약이 성공적으로 완료되었습니다!");
      $("#calendarModal").modal("hide");
    }
  });
});

// 달력을 초기화하는 함수
function initializeCustomCalendar() {
  // 달력 및 시간 선택 초기화 로직을 여기에 추가하고 싶은 경우에 추가하세용
}

document.addEventListener("DOMContentLoaded", function () {
  const calendarBody = document.querySelector(".calendar tbody");
  const monthYearDisplay = document.querySelector(".month-year");
  const prevMonthButton = document.querySelector(".prev-month");
  const nextMonthButton = document.querySelector(".next-month");
  const timeButtons = document.querySelectorAll(".time-picker button");
  const peopleInput = document.getElementById("people");
  let currentDate = new Date();
  let selectedDate = null;
  let selectedTime = null;
  let selectedPeople = 1; // 기본값 1명

  /**
   * 공휴일 데이터 가져오기
   * @param {number} year - 년도
   * @param {number} month - 월 (0부터 시작)
   * @returns {Promise<Array>} - 주어진 년도와 월의 공휴일 리스트
   */
  const get_Holidays = async function (year, month) {
    try {
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/KR`
      );
      const holidays = await response.json();
      return holidays.filter(
        (holiday) => new Date(holiday.date).getMonth() === month
      );
    } catch (error) {
      console.error("공휴일 데이터를 가져오는 중 오류 발생:", error);
      return [];
    }
  };

  /**
   * 예약 불가일 데이터 생성 (예: 매주 월요일 예약 불가)
   * @param {number} year - 년도
   * @param {number} month - 월 (0부터 시작)
   * @returns {Array<Date>} - 주어진 년도와 월의 예약 불가일 리스트
   */
  const get_UnavailableDates = function (year, month) {
    let unavailableDates = [];
    let date = new Date(year, month, 1);

    while (date.getMonth() === month) {
      if (date.getDay() === 1) {
        // 월요일
        unavailableDates.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }
    return unavailableDates;
  };

  /**
   * 달력 생성 및 렌더링
   * @param {Date} date - 현재 선택된 날짜
   */
  const get_Calendar = async function (date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    monthYearDisplay.textContent = `${year}년 ${month + 1}월`;
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    let holidays = await get_Holidays(year, month);

    // 기존 캘린더 클리어
    calendarBody.innerHTML = ""; // Clear previous calendar

    let row = document.createElement("tr");
    for (let i = 0; i < firstDay; i++) {
      row.appendChild(document.createElement("td"));
    }

    for (let day = 1; day <= lastDate; day++) {
      let cell = document.createElement("td");
      let currentDay = new Date(year, month, day);
      cell.textContent = day;

      let holiday = holidays.find(
        (holiday) => new Date(holiday.date).getDate() === day
      );

      if (holiday) {
        cell.classList.add("holiday");
        cell.title = holiday.localName; // 휴일 이름에 대한 도구 설명
        let holidayName = document.createElement("div");
        holidayName.textContent = holiday.localName;
        holidayName.style.fontSize = "8px"; // 글자 크기
        holidayName.style.color = "#d9534f"; // 공휴일 색상
        cell.appendChild(holidayName);
      }

      if (!cell.classList.contains("disabled")) {
        // 'disabled' 클래스를 제거하고 선택 가능하게 변경
        cell.addEventListener("click", function () {
          calendarBody
            .querySelectorAll("td")
            .forEach((td) => td.classList.remove("selected"));
          cell.classList.add("selected");
          selectedDate = currentDay;
        });
      }

      row.appendChild(cell);
      if ((firstDay + day) % 7 === 0 || day === lastDate) {
        calendarBody.appendChild(row);
        row = document.createElement("tr");
      }
    }
  };

  // 이전/다음 달로 이동
  prevMonthButton.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    get_Calendar(currentDate);
  });

  nextMonthButton.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    get_Calendar(currentDate);
  });

  // 시간 선택
  timeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      timeButtons.forEach((btn) => btn.classList.remove("selected"));
      this.classList.add("selected");
      selectedTime = this.textContent;
    });
  });

  // 인원수 입력 처리
  peopleInput.addEventListener("input", function () {
    selectedPeople = this.value;
  });

  // 예약 제출
  document.querySelector(".submit").addEventListener("click", function () {
    if (selectedDate && selectedTime && selectedPeople > 0) {
      console.log(
        `예약 정보 - 날짜: ${selectedDate.toLocaleDateString()}, 시간: ${selectedTime}, 인원수: ${selectedPeople}`
      );
      // 여기에 서버로 데이터를 전송하는 코드를 추가할 수 있습니다.
    } else {
      console.error("날짜, 시간, 인원수를 모두 선택해주세요.");
    }
  });

  get_Calendar(currentDate);
});
