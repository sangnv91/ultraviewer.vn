document.addEventListener('DOMContentLoaded', function() {
    var expandedBox = document.getElementById('popup-expanded-box');
    var collapsedIcon = document.getElementById('popup-collapsed-icon');
    var closeBtn = document.getElementById('popup-close-btn');
    var collapsedCloseBtn = document.getElementById('popup-collapsed-close-btn');
    var collapsedLink = document.getElementById('popup-collapsed-link');
    var shopeeLink = "https://amzn.to/44eQ3W2"; // Link Shopee chung

    // Kiểm tra xem các phần tử có tồn tại trên trang không để tránh lỗi JS
    if (!expandedBox || !collapsedIcon) return;

    // 1. Sự kiện click nút X (của popup lớn): Ẩn popup + Mở link + Hiện icon nhỏ
    if (closeBtn) {
        closeBtn.onclick = function() {
            expandedBox.style.display = 'none';      
            collapsedIcon.style.display = 'block';   
            window.open(shopeeLink, '_blank');       
        };
    }

    // 2. Sự kiện click vào ảnh (của icon nhỏ): Mở popup + Mở link + Ẩn icon nhỏ
    if (collapsedLink) {
        collapsedLink.onclick = function(e) {
            e.preventDefault(); // Ngăn thẻ <a> chuyển hướng trực tiếp
            collapsedIcon.style.display = 'none';    
            expandedBox.style.display = 'flex';      
            window.open(shopeeLink, '_blank');       
        };
    }

    // 3. Sự kiện click nút X (của icon nhỏ): Tắt hẳn luôn banner
    if (collapsedCloseBtn) {
        collapsedCloseBtn.onclick = function() {
            collapsedIcon.style.display = 'none';
        };
    }
});