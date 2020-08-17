$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
  });

  // Click event for new note.
  $(document).on("click", "#new-post", newNote);

  // Function to add note to db and reload page.
  function newNote(stickyNote) {
    $.post("/api/notes", () => {
      return stickyNote;
    }).then(location.reload());
  }

  // InteractJS library code

  // target elements with the "draggable" class
  interact(".draggable").draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      end(event) {
        console.log(event);
      }
    }
  });

  function dragMoveListener(event) {
    const target = event.target;
    const id = target.getAttribute("id");

    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform = target.style.transform =
      "translate(" + x + "px, " + y + "px)";

    // update the position attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);

    const coords = {
      id: id,
      x: x,
      y: y
    };

    // This function updates a note position in our database
    updateNoteCoordinates(coords);
  }

  // This function updates a note position in our database
  const updateNoteCoordinates = coords => {
    $.ajax({
      method: "PUT",
      url: "/api/notes",
      data: coords
    }).then(() => {
      location.reload();
    });
  };

  // this function is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;
});
