
$(document).ready(function () {

    const form = $("#subscriptionForm");
    const subscriptionList = $("#subscriptionList");

    let subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

    function saveSubscriptions() {
        localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
    }

    function getStatus(renewalDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const renewal = new Date(renewalDate + "T00:00:00");

        return renewal < today ? "Expired" : "Active";
    }

    function displaySubscriptions() {
        subscriptionList.empty();

        $.each(subscriptions, function (index, subscription) {

            const row = $("<tr>");

            const values = [
                subscription.service,
                subscription.provider,
                subscription.subscriber,
                subscription.renewalDate,
                subscription.category,
                getStatus(subscription.renewalDate)
            ];

            $.each(values, function (i, value) {
                row.append($("<td>").text(value));
            });

            const deleteButton = $("<button>")
                .text("Delete")
                .addClass("btn btn-danger btn-sm");

            deleteButton.on("click", function () {
                subscriptions.splice(index, 1);
                saveSubscriptions();
                displaySubscriptions();
            });

            row.append($("<td>").append(deleteButton));
            subscriptionList.append(row);
        });

        updateSummary();
    }

    function updateSummary() {
        $("#totalSubscriptions").text(subscriptions.length);

        const expired = $.grep(subscriptions, function (subscription) {
            return getStatus(subscription.renewalDate) === "Expired";
        });

        $("#expiredSubscriptions").text(expired.length);
    }

    form.on("submit", function (event) {
        event.preventDefault();

        const subscription = {
            service: $("#service").val(),
            provider: $("#provider").val(),
            subscriber: $("#subscriber").val(),
            renewalDate: $("#renewalDate").val(),
            category: $("#category").val()
        };

        subscriptions.push(subscription);

        saveSubscriptions();
        form[0].reset();
        displaySubscriptions();
    });

    displaySubscriptions();

});


