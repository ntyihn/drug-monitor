// middleware/validateDrug.js

// Middleware kiểm tra dữ liệu đầu vào khi thêm/sửa thuốc
module.exports.validateDrug = (req, res, next) => {
    console.log("Dữ liệu nhận được:", req.body)
    let { name, dosage, card, pack, perDay } = req.body;

    // ép kiểu về số để check
    card = Number(card);
    pack = Number(pack);
    perDay = Number(perDay);

    // a. Tên phải có độ dài > 5
    if (!name || name.length <= 5) {
        return res.status(400).send({ message: "Name must be longer than 5 characters" });
    }

    // b. Dosage phải theo format: XX-morning,XX-afternoon,XX-night (X là số)
    const dosagePattern = /^\d{1,2}-morning,\d{1,2}-afternoon,\d{1,2}-night$/;
    if (!dosagePattern.test(dosage)) {
        return res.status(400).send({ message: "Dosage format must be XX-morning,XX-afternoon,XX-night" });
    }

    // c. Card > 1000
    if (!Number.isInteger(card) || card <= 1000) {
        return res.status(400).send({ message: `Card must be greater than 1000, got ${req.body.card}` });
    }


    // d. Pack > 0
    if (isNaN(pack) || pack <= 0) {
        return res.status(400).send({ message: "Pack must be greater than 0" });
    }

    // e. PerDay > 0 và < 90
    if (isNaN(perDay) || perDay <= 0 || perDay >= 90) {
        return res.status(400).send({ message: "PerDay must be between 1 and 89" });
    }


    // Nếu tất cả điều kiện đều hợp lệ thì cho đi tiếp
    next();
};
