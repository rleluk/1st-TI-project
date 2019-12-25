function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}

function random_rgba(alpha = 1.) {
    let r = Math.round(Math.random() * 160 + 40);
    let g = Math.round(Math.random() * 160 + 40);
    let b = Math.round(Math.random() * 160 + 40);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}