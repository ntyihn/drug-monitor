let url = location.host;//so it works locally and online

$("table").rtResponsiveTables();//for the responsive tables plugin

// $("#add_drug").submit(function(event){//on a submit event on the element with id add_drug
//     alert($("#name").val() + " sent successfully!");//alert this in the browser
// })

$("#add_drug").submit(function(event){
    event.preventDefault(); // chặn submit mặc định

    let data = {
        name: $("#name").val(),
        card: $("#card").val(),
        pack: $("#pack").val(),
        perDay: $("#perDay").val(),
        dosage: $("#dosage").val()
    };

    $.ajax({
        url: "/api/drugs",
        method: "POST",
        data: data,
        success: function(response){
            alert($("#name").val() + " sent successfully!");
            window.location.href = "/manage";
        },
        error: function(xhr){
            alert("Error: " + xhr.responseText);
        }
    });
});


$("#update_drug").submit(function(event){// on clicking submit
    event.preventDefault();//prevent default submit behaviour

    //var unindexed_array = $("#update_drug");
    var unindexed_array = $(this).serializeArray();//grab data from form
    var data = {}

    $.map(unindexed_array, function(n, i){//assign keys and values from form data
        data[n['name']] = n['value']
    })


    var request = {//use a put API request to use data from above to replace what's on database
    "url" : `http://${url}/api/drugs/${data.id}`,
    "method" : "PUT",
    "data" : data
}

$.ajax(request).done(function(response){
    alert(data.name + " Updated Successfully!");
		window.location.href = "/manage";//redirects to index after alert is closed
    })

})

 if(window.location.pathname == "/manage"){//since items are listed on manage
     $ondelete = $("table tbody td a.delete"); //select the anchor with class delete
     $ondelete.click(function(){//add click event listener
         let id = $(this).attr("data-id") // pick the value from the data-id

         let request = {//save API request in variable
             "url" : `http://${url}/api/drugs/${id}`,
             "method" : "DELETE"
         }

         if(confirm("Do you really want to delete this drug?")){// bring out confirm box
             $.ajax(request).done(function(response){// if confirmed, send API request
                 alert("Drug deleted Successfully!");//show an alert that it's done
                 location.reload();//reload the page
            })
        }

     })
 }


if(window.location.pathname.startsWith("/purchase")) {
    $("#drug_days").submit(function(event) {
        event.preventDefault();
        let days = parseInt($("#days").val(), 10);
        if (isNaN(days) || days <= 0) {
            alert("Vui lòng nhập số ngày hợp lệ!");
            return;
        }

        $("#purchase_table tbody").empty(); // reset bảng

        drugs.forEach((drug, i) => {
            let pills = days * drug.perDay;
            let cards = Math.ceil(pills / drug.card);
            let packs = Math.ceil(pills / drug.pack);
            let perPackText = (drug.pack / drug.card < 2) ? "card" : "cards";

            $("#purchase_table tbody").append(`
                <tr>
                    <td>${i + 1}</td>
                    <td>${drug.name}</td>
                    <td>${cards} (${drug.pack/drug.card} ${perPackText} per pack)</td>
                    <td>${packs}</td>
                </tr>
            `);
        });

        $("#purchase_table").show();
    });
}
