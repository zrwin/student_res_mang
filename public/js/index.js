$("#update_user").submit(function (event) {
  event.preventDefault();

  var unindexed_array = $(this).serializeArray();
  var data = {};

  $.map(unindexed_array, function (n, i) {
    data[n["name"]] = n["value"];
  });

  var request = {
    url: `/api/students/${data.id}`,
    method: "PUT",
    data: data,
  };

  $.ajax(request).done(function (response) {
    alert("Data Updated Successfully!");
  });
});

$("#update_result").submit(function (event) {
  event.preventDefault();
  console.log($(this).serializeArray());
  var unindexed_array = $(this).serializeArray();
  var data = {};

  $.map(unindexed_array, function (n, i) {
    data[n["name"]] = n["value"];
  });

  var request = {
    url: `/api/results/${data.id}`,
    method: "PUT",
    data: data,
  };

  $.ajax(request).done(function (response) {
    alert("Data Updated Successfully!");
  });
});

let deletebtn = $(".table tbody td .delete");

deletebtn.click(() => {
  const id = deletebtn.attr("data-id");
  const request = {
    url: `/api/students/${id}`,
    method: "DELETE",
  };

  if (confirm("Do you really want to delete this record")) {
    $.ajax(request).done(() => {
      alert("Data deleted successfully");
    });
    location.reload();
  }
});

let deleteResult = $(".table tbody td .delete-result");

deleteResult.click(() => {
  const id = deleteResult.attr("data-id");
  const request = {
    url: `/api/results/${id}`,
    method: "DELETE",
  };
  if (confirm("Do you really want to delete this result record!!!")) {
    $.ajax(request).done(() => {
      alert("Data Deleted Successfully");
    });
    location.reload();
  }
});
