export class MouseInput {
    static x = 0;
    static y = 0;
    static justPressed = false;
    static init(canvas) {
        canvas.addEventListener('mousemove', e => {
            const rect = canvas.getBoundingClientRect();
            MouseInput.x = e.clientX - rect.left;
            MouseInput.y = e.clientY - rect.top;
        });
        canvas.addEventListener('mousedown', () => {
            MouseInput.justPressed = true;
        });
    }
}
