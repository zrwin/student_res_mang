$("#update_user").submit(function (event) {
  event.preventDefault();

  var unindexed_array = $(this).serializeArray();
  var data = {};
  console.log(unindexed_array);

  $.map(unindexed_array, function (n, i) {
    data[n["name"]] = n["value"];
  });
  console.log(data);
  var request = {
    url: `/api/students/${data.id}`,
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
