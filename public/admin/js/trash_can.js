// Restore Item
const buttonsRestore = document.querySelectorAll("[button-restore]");

if (buttonsRestore.length > 0) {
    const formRestore = document.querySelector("#form-restore-item");
    const path = formRestore.getAttribute("data-path");

    buttonsRestore.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn khôi phục sản phẩm này");

            if (isConfirm) {
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=PATCH`;
                formRestore.action = action;
                formRestore.submit();
            }
        });
    });
}