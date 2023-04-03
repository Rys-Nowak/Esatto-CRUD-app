function getNewCustomerData() {
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const vatId = document.getElementById("vatId").value;

    if (name === "" || address === "" || vatId === "") {
        alert("Please fill in all fields before submitting");
        return;
    }

    console.log(
        `Creating customer ${name} with address ${address} and VAT ID ${vatId}`
    );

    fetch("https://esatto-crud-app.azurewebsites.net/api/customers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            address,
            vatId,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Success:", data);
            alert(`Customer ${data.name} created successfully with id ${data.customerId}`);
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Error creating customer: ", error.message);
        });
}
