$(document).ready(function () {
  // show/hide menu
  $(document).on("click", ".btn-icon", function (e) {
    if ($(".aside-secondary").hasClass("active")) {
      $(this).removeClass("active");
      $(".aside-secondary").css("width", "0");
      $(".aside-secondary").removeClass("active");
      $(".container-content").css("padding-left", "100px");
    } else {
      $(this).addClass("active");
      $(".aside-secondary").css("width", "325px");
      $(".aside-secondary").addClass("active");
      $(".container-content").css("padding-left", "425px");
    }
  });

  //Run function to drag and drop item
  getScore();
  dragNdrop();

  let draggedItem = null;

  function dragNdrop() {
    for (let i = 0; i < $(".menu-item").length; i++) {
      const item = $(".menu-item")[i];

      item.addEventListener("dragstart", function () {
        draggedItem = item;
        $(this).css("opacity", 0.4);
      });

      item.addEventListener("dragend", function () {
        draggedItem = null;
        $(this).css("opacity", 1);
      });

      for (let j = 0; j < $(".menu-list").length; j++) {
        const list = $(".menu-list")[j];
        list.addEventListener("dragover", (e) => e.preventDefault());

        list.addEventListener("dragenter", function (e) {
          e.preventDefault();
        });

        list.addEventListener("dragleave", function (e) {});

        list.addEventListener("drop", function (e) {
          e.preventDefault();
          e.stopPropagation();
          this.append(draggedItem);
          getScore();
        });
      }
    }
  }

  // Delete item
  $(".btn-delete").click(function () {
    $(this)
      .parents(".menu-item")
      .fadeOut(400, function () {
        $(this).remove();
        getScore();
      });
  });

  // Copy item
  $(".btn-copy").click(function () {
    $(this)
      .parents(".menu-item")
      .clone(true)
      .appendTo($(this).parents(".menu-list"));
    dragNdrop();
    getScore();
  });

  // Modal
  const btns = document.querySelectorAll("[data-target-modal]");
  const close_modals = document.querySelectorAll(".close-modal");
  const overlay = document.getElementById("overlay");

  btns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      document
        .querySelector(btn.dataset.targetModal)
        .classList.add("active-modal");
      overlay.classList.add("active-modal");
    });
  });

  close_modals.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const modal = btn.closest(".modal-add");
      modal.classList.remove("active-modal");
      overlay.classList.remove("active-modal");
    });
  });

  window.onclick = (event) => {
    if (event.target == overlay) {
      const modals = document.querySelectorAll(".modal-add");
      modals.forEach((modal) => modal.classList.remove("active-modal"));
      overlay.classList.remove("active-modal");
    }
  };

  // Create todo task
  $(document).on("click", "#todo_submit", function () {
    createTodo();
    getScore();
  });

  function createTodo() {
    const todo_li = document.createElement("li");
    const input_val = $("#todo_input").val();

    // add attributes for li class
    $(todo_li).addClass("menu-item d-flex flex-column justify-content-between");
    $(todo_li).attr("draggable", "true");

    // create heading element
    const p_heading = document.createElement("p");
    const p_txt = document.createTextNode(input_val);
    $(p_heading).addClass("menu-item-heading fw-bold d-flex flex-wrap");
    $(p_heading).append(p_txt);

    $(todo_li).append(p_heading);

    // create div div info
    const div_info = document.createElement("div");
    $(div_info).addClass(
      "menu-item-edit d-flex justify-content-end align-items-center"
    );

    $(todo_li).append(div_info);

    // create delete button
    const delete_btn = document.createElement("button");
    const delete_icon = `<i class="bx bxs-trash-alt delete-icon"></i>`;

    $(delete_btn).addClass("btn-delete");
    $(delete_btn).append(delete_icon);

    $(div_info).append(delete_btn);

    // create delete button
    const copy_btn = document.createElement("button");
    const copy_icon = `<i class="bx bxs-copy-alt copy-icon"></i>`;

    $(copy_btn).addClass("btn-copy");
    $(copy_btn).append(copy_icon);

    $(div_info).append(copy_btn);

    // add event drag/drop
    todo_li.addEventListener("dragstart", function () {
      draggedItem = this;
      $(this).css("opacity", 0.4);
    });

    todo_li.addEventListener("dragend", function () {
      draggedItem = null;
      $(this).css("opacity", 1);
    });

    // delete task
    $(delete_btn).click(function () {
      $(this)
        .parents(".menu-item")
        .fadeOut(500, function () {
          $(this).remove();
          getScore();
        });
    });

    // Copy item
    $(copy_btn).click(function () {
      $(this)
        .parents(".menu-item")
        .clone(true)
        .appendTo($(this).parents(".menu-list"));
      getScore();
      dragNdrop();
    });

    if (input_val.trim() != 0) {
      todo_form.classList.remove("active-modal");
      overlay.classList.remove("active-modal");

      // append item into status list
      let status_check = $("#task_option :selected").val();
      $("#" + status_check).append(todo_li);

      // add animation to add item
      // $(todo_li).css("animation", "show 0.5s linear");

      // reset value input
      resetForm();
    }
  }

  // reset form
  const resetForm = () => {
    $("#todo_input").val("");
    $("#task_option").prop("selectedIndex", 0);
  };

  // check quantity of task in list
  function getScore() {
    $("#status_started_sore").html($("#status_started li").length);
    $("#status_progress_sore").html($("#status_progress li").length);
    $("#status_completed_sore").html($("#status_completed li").length);
    $("#status_schedule_score").html($("#status_schedule li").length);
    $("#status_pending_score").html($("#status_pending li").length);
  }

  // Sortable item in list
  $(function () {
    $(
      "#status_started, #status_progress, #status_completed, #status_schedule, #status_pending "
    )
      .sortable({
        connectWith: ".menu-list",
        update: function (event, ui) {
          getScore();
        },
        revert: 250,
      })
      .disableSelection();
  });
});
