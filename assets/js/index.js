var courseName_input = document.querySelector("#courseName");
var courseCategory_input = document.querySelector("#courseCategory");
var coursePrice_input = document.querySelector("#coursePrice");
var courseDescription_input = document.querySelector("#courseDescription");
var courseCapacity_input = document.querySelector("#courseCapacity");
var addCourse_btn = document.querySelector("#addCourse");
var clear_btn = document.querySelector("#clear");
var search_input = document.querySelector("#search");
var deleteAll_btn = document.querySelector("#deleteAll");
var tbody = document.querySelector("#tbody");
let deleteSpecificRow_btn = "";
var updateSpecificRow_btn = "";
var rowID = "";
var allCourses = [];
if (JSON.parse(localStorage.getItem("allCourses")) == null) {
  localStorage.setItem("allCourses", "[]");
} else {
  allCourses = JSON.parse(localStorage.getItem("allCourses"));
}
document.onreadystatechange = function () {
  displayInTable(allCourses);
  setDeleteAllBtn();
};

addCourse_btn.addEventListener("click", function (e) {
  e.preventDefault();
  if (addCourse_btn.value == "Add Course") {
    addCourse();
    const Toast = Swal.mixin({
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: "added successfully",
    });
  } else {
    updateCourse(rowID);
    addCourse_btn.value = "Update Course";
  }
  setDeleteAllBtn();
});
clear_btn.addEventListener("click", function (e) {
  e.preventDefault();
  clearInputs();
});
deleteAll_btn.addEventListener("click", function (e) {
  e.preventDefault();
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          "Deleted!",
          "Your file has been deleted.",
          "success"
        );
        allCourses = [];
        clearInputs();
        displayInTable(allCourses);
        setDeleteAllBtn();
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          "Cancelled",
          "Your imaginary file is safe :)",
          "error"
        );
      }
    });
});
search_input.addEventListener("keyup", function () {
  var courses = [];
  for (var i = 0; i < allCourses.length; i++) {
    if (
      allCourses[i].courseName
        .toLowerCase()
        .includes(search_input.value.toLowerCase())
    ) {
      courses.push(allCourses[i]);
    }
  }
  displayInTable(courses);
});
courseName_input.addEventListener("keyup", function () {
  var pattern = /^[A-Z][a-z]{3,10}$/;
  validation(pattern, this);
});
courseCategory_input.addEventListener("keyup", function () {
  var pattern = /^[A-Z][a-z]{3,20}/;
  validation(pattern, this);
});
coursePrice_input.addEventListener("keyup", function () {
  var pattern = /^([1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/;
  validation(pattern, this);
});
courseDescription_input.addEventListener("keyup", function () {
  var pattern = /^[A-Z][a-z]{3}/;
  validation(pattern, this);
});
courseCapacity_input.addEventListener("keyup", function () {
  var pattern = /^([1-9][0-9]|[1][0-9][0-9]|200)$/;
  validation(pattern, this);
});

function addCourse() {
  data = {
    courseName: courseName_input.value,
    courseCategory: courseCategory_input.value,
    coursePrice: coursePrice_input.value,
    courseDescription: courseDescription_input.value,
    courseCapacity: courseCapacity_input.value,
  };
  allCourses.push(data);
  displayInTable(allCourses);
  clearInputs();
}
function updateCourse(rowID) {
  (allCourses[rowID].courseName = courseName_input.value),
    (allCourses[rowID].courseCategory = courseCategory_input.value),
    (allCourses[rowID].coursePrice = coursePrice_input.value),
    (allCourses[rowID].courseDescription = courseDescription_input.value),
    (allCourses[rowID].courseCapacity = courseCapacity_input.value),
    displayInTable(allCourses);
  clearInputs();
  checkValidInputs();
}
function displayInTable(courses) {
  if (courses.length == 0) {
    tbody.innerHTML = `
        <th class='border-0 text-danger'>Empty</td>
        `;
  } else {
    var data = "";
    for (var i = 0; i < courses.length; i++) {
      data += `<tr>
                    <th scope="row" class="rowID">${i}</td>
                    <td>${courses[i].courseName}</td>
                    <td>${courses[i].courseCategory}</td>
                    <td>${courses[i].coursePrice}</td>
                    <td>${courses[i].courseDescription}</td>
                    <td>${courses[i].courseCapacity}</td>
                    <td>
                        <button class="btn btn-outline-danger deleteSpecificRow" name="deleteSpecificRow">Delete</button>
                    </td>
                    <td>
                        <button class="btn btn-outline-secondary updateSpecificRow" name="updateSpecificRow">Update</button>
                    </td>
                </tr>`;
    }
    tbody.innerHTML = data;
    if (courses.length > 0) {
      deleteSpecificRow_btn = document.querySelectorAll(".deleteSpecificRow");
      addEventToDeleteBtnRow(courses);
      updateSpecificRow_btn = document.querySelectorAll(".updateSpecificRow");
      addEventToUpdateBtnRow(courses);
    }
  }
  localStorage.setItem("allCourses", JSON.stringify(allCourses));
}
function clearInputs() {
  document.querySelectorAll(".input").forEach(function (input) {
    input.value = "";
    input.classList.remove("is-valid");
  });
  addCourse_btn.setAttribute("disabled", "disabled");
}
function addEventToDeleteBtnRow(courses) {
  for (var i = 0; i < courses.length; i++) {
    deleteSpecificRow_btn[i].addEventListener("click", function () {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
              "Deleted!",
              "Your file has been deleted.",
              "success"
            );
            var rowID = Number(
              this.parentElement.parentElement.querySelector(".rowID").innerHTML
            );
            courses.splice(rowID, 1);
            addCourse_btn.value = "Add Course";
            displayInTable(courses);
            setDeleteAllBtn();
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              "Cancelled",
              "Your imaginary file is safe :)",
              "error"
            );
          }
        });
    });
  }
}
function addEventToUpdateBtnRow(courses) {
  for (var i = 0; i < courses.length; i++) {
    updateSpecificRow_btn[i].addEventListener("click", function () {
      rowID = Number(
        this.parentElement.parentElement.querySelector(".rowID").innerHTML
      );
      courseName_input.value = courses[rowID].courseName;
      courseCategory_input.value = courses[rowID].courseCategory;
      coursePrice_input.value = courses[rowID].coursePrice;
      courseDescription_input.value = courses[rowID].courseDescription;
      courseCapacity_input.value = courses[rowID].courseCapacity;
      addCourse_btn.value = "Update Course";
      addCourse_btn.addEventListener("click", function () {
        addCourse_btn.value = "Add Course";
      });
      document.querySelectorAll(".input").forEach(function (input) {
        input.classList.add("is-valid");
      });
      checkValidInputs();
    });
  }
}
function validation(pattern, input) {
  var validation_text = input.parentElement.querySelector(".validation");
  if (pattern.test(input.value)) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    validation_text.classList.remove("d-block");
    validation_text.classList.add("d-none");
    checkValidInputs();
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    validation_text.classList.remove("d-none");
    validation_text.classList.add("d-block");
  }
}
function checkValidInputs() {
  var inputs = document.querySelectorAll(".input");
  var validArr = [];
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].classList.contains("is-valid")) {
      validArr.push(true);
    }
  }
  if (validArr.length == inputs.length) {
    addCourse_btn.removeAttribute("disabled");
  }
}
function setDeleteAllBtn() {
  if (allCourses.length > 0) {
    deleteAll_btn.removeAttribute("disabled");
  } else {
    deleteAll_btn.setAttribute("disabled", "disabled");
  }
}
