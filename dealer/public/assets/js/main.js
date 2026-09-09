$(document).ready(function () {
  $(".ct_menu_bar").click(function () {
    $("main").addClass("ct_show");
  });
  $(".ct_close_sidebar").click(function () {
    $("main").removeClass("ct_show");
  });

  //   Dash Graph js S
});





$(document).ready(function () {

    var current_fs, next_fs, previous_fs;
    var opacity;
    var current = 1;
    var steps = $("#msform fieldset").length;

    // Hide all fieldsets except first
    $("#msform fieldset").hide();
    $("#msform fieldset:first").show();

    updateStepper(current);

    // NEXT BUTTON
    $(".ct_form_next").click(function () {

        current_fs = $(this).closest("fieldset");
        next_fs = current_fs.next("fieldset");

        if (next_fs.length) {

            next_fs.show();

            current_fs.animate({
                opacity: 0
            }, {
                duration: 500,
                step: function (now) {

                    opacity = 1 - now;

                    current_fs.css({
                        display: "none",
                        position: "relative"
                    });

                    next_fs.css({
                        opacity: opacity
                    });

                }
            });

            current++;

            updateStepper(current);
        }

    });

    // PREVIOUS BUTTON
    $(".previous").click(function () {

        current_fs = $(this).closest("fieldset");
        previous_fs = current_fs.prev("fieldset");

        if (previous_fs.length) {

            previous_fs.show();

            current_fs.animate({
                opacity: 0
            }, {
                duration: 500,
                step: function (now) {

                    opacity = 1 - now;

                    current_fs.css({
                        display: "none",
                        position: "relative"
                    });

                    previous_fs.css({
                        opacity: opacity
                    });

                }
            });

            current--;

            updateStepper(current);
        }

    });


    // UPDATE PROGRESSBAR
    function updateStepper(curStep) {

        var $items = $("#ct_form_progressbar li");

        $items.removeClass("active completed");
        $items.find(".ct_step_circle").removeClass("active completed");

        $items.each(function (index) {

            if (index < curStep - 1) {

                $(this).addClass("completed");
                $(this).find(".ct_step_circle")
                    .addClass("completed")
                    .html("✓");

            }

            else if (index == curStep - 1) {

                $(this).addClass("active");

                $(this).find(".ct_step_circle")
                    .addClass("active")
                    .html(index + 1);

            }

            else {

                $(this).find(".ct_step_circle")
                    .html(index + 1);

            }

        });

        // Scroll active step into view on mobile
        var activeStep = $items.eq(curStep - 1)[0];

        if (activeStep) {
            activeStep.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest"
            });
        }
        // LAST STEP BUTTON
$("#createVanProfile").click(function () {

    var successModal = new bootstrap.Modal(
        document.getElementById("successModal")
    );

    successModal.show();

});

    }

});