//
// ملف script.js - المنطق البرمجي لقائمة طعام بشار التميمي
// 

let cart = {}; 
let totalPrice = 0; 

const totalDisplay = document.getElementById('total-display');
const whatsappButton = document.getElementById('whatsapp-button');
const menuItems = document.querySelectorAll('#menu-items li');
const notesField = document.getElementById('notes'); 

// تأكد من أن هذا هو رقمك الصحيح
const YOUR_WHATSAPP_NUMBER = "967733971941"; 

// تفاصيل الدفع 
const PAYMENT_DETAILS = 
    `\n---\n*طرق الدفع المتاحة:*\n` +
    `* 💵 نقداً عند الاستلام (العربة).\n` +
    `* 📱 خدمة حاسب (رمز الدفع: 1466204) على الرقم 967733971941.`;


menuItems.forEach(item => {
    const itemId = item.getAttribute('data-item-id');
    cart[itemId] = 0;
});

function updateOrderSummary() {
    totalPrice = 0;
    let totalItems = 0;

    menuItems.forEach(item => {
        const itemId = item.getAttribute('data-item-id');
        const itemPrice = parseInt(item.getAttribute('data-price'));
        const quantity = cart[itemId];

        totalPrice += quantity * itemPrice;
        totalItems += quantity;

        document.getElementById(`qty-${itemId}`).textContent = quantity;
    });

    totalDisplay.textContent = `إجمالي الطلب: ${totalPrice} ريال يمني`;

    whatsappButton.disabled = totalItems === 0;
}


// دالة تعديل الكمية 
function changeQuantity(itemId, action) {
    let currentQty = cart[itemId];
    const isHotSauce = itemId === '4'; 

    if (action === 'plus') {
        // إذا كان صوص حار وكميته 1، لا تزد العدد
        if (isHotSauce && currentQty >= 1) {
            return; 
        }
        cart[itemId] = currentQty + 1;
    } else if (action === 'minus' && currentQty > 0) {
        cart[itemId] = currentQty - 1;
    }

    updateOrderSummary();
}

// ربط الأزرار
document.querySelectorAll('.quantity-plus').forEach(button => {
    button.addEventListener('click', () => {
        const itemId = button.getAttribute('data-id');
        changeQuantity(itemId, 'plus');
    });
});

document.querySelectorAll('.quantity-minus').forEach(button => {
    button.addEventListener('click', () => {
        const itemId = button.getAttribute('data-id');
        changeQuantity(itemId, 'minus');
    });
});


// دالة إرسال الطلب عبر الواتساب (تضمين الملاحظات)
whatsappButton.addEventListener('click', () => {
    let itemsList = [];
    const notes = notesField.value.trim(); 


    menuItems.forEach(item => {
        const itemId = item.getAttribute('data-item-id');
        const itemName = item.getAttribute('data-item-name');
        const quantity = cart[itemId];

        if (quantity > 0) {
            itemsList.push(`(${quantity}x) ${itemName}`);
        }
    });

    const itemsListText = itemsList.join('\n');

    let whatsappMessage = 
        `*طلب جديد من عربة بشار التميمي* 👑\n\n` +
        `*قائمة الطلبات:*\n${itemsListText}\n\n` +
        `*الإجمالي النهائي:* ${totalPrice} ريال يمني\n\n`;

    // إضافة الملاحظات إذا وجدت
    if (notes) {
        whatsappMessage += `*📝 ملاحظات العميل:* ${notes}\n\n`;
    }

    whatsappMessage += PAYMENT_DETAILS + 
        `\n---\n` + 
        `*شكراً لاختيارك طعمية وفلافل بشار التميمي!*`; 

    const encodedMessage = encodeURIComponent(whatsappMessage);

    const whatsappUrl = `whatsapp://send?phone=${YOUR_WHATSAPP_NUMBER}&text=${encodedMessage}`;

    window.open(whatsappUrl, '_system');
});
      
