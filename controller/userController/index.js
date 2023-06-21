const Joi = require('joi');
const userModel = require("../../model/userModel");

const getUserInfo = async (req, res) => {
    try {
        console.log(req.headers.authorization);
        const userId = await userModel.getUserId(req.headers.authorization);
        console.log(userId);

        if (!userId) return res.status(403).json('Vui lòng đăng nhập!');

        const user = await userModel.getAdmin(userId);
        console.log(user);
    
        return res.status(200).json(user);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ detail: e.message });  
    }
}

const updateUser = async (req, res) => {
    try {
        console.log(req.headers.authorization);
        const userId = await userModel.getUserId(req.headers.authorization);
        console.log(userId);

        if (!userId) return res.status(403).json('Vui lòng đăng nhập!');
        const user = req.body.user;
        console.log(user);

        const result = await userModel.updateUser(user, userId);
        console.log(result);

        const _user = await userModel.getAdmin(userId);
        console.log(_user);
    
        return res.status(200).json(user);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ detail: e.message });  
    }
}

const getStudent = async (req, res) => {
    try {
        console.log(req.headers.authorization);
        const userId = await userModel.getUserId(req.headers.authorization);
        console.log(userId);

        if (!userId) return res.status(403).json('Vui lòng đăng nhập!');

        const user = await userModel.getStudent(userId);
        console.log(user);
    
        return res.status(200).json(user);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ detail: e.message }); 
    }
}

const updateStudent = async (req, res) => {
    try {
        console.log(req.headers.authorization);
        const userId = await userModel.getUserId(req.headers.authorization);
        console.log(userId);

        if (!userId) return res.status(403).json('Vui lòng đăng nhập!');

        const user = req.body.user;
        console.log(user);
        const result = await userModel.updateUser(user, userId);
        await userModel.updateStudent(user);
        console.log(result);
    
        const _user = await userModel.getStudent(userId);
        console.log(_user);
    
        return res.status(200).json(_user);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ detail: e.message }); 
    }
}

const getTeacher = async (req, res) => {
    try {
        console.log(req.headers.authorization);
        const userId = await userModel.getUserId(req.headers.authorization);
        console.log(userId);

        if (!userId) return res.status(403).json('Vui lòng đăng nhập!');

        const user = await userModel.getTeacher(userId);
        console.log(user);
    
        return res.status(200).json(user);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ detail: e.message }); 

    }
}

const updateTeacher = async (req, res) => {
    try {
        console.log(req.headers.authorization);
        const userId = await userModel.getUserId(req.headers.authorization);
        console.log(userId);

        if (!userId) return res.status(403).json('Vui lòng đăng nhập!');

        const user = req.body.user;
        console.log(user);
        const result = await userModel.updateUser(user, userId);
        console.log(result);

        await userModel.updateTeacher(user);
    
        const _user = await userModel.getTeacher(userId);
        console.log(_user);
    
        return res.status(200).json(_user);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ detail: e.message }); 
    }
}
const handleLoginInput = (req, res) => {
    const { username, pass } = req.body;
    if (username === '' || pass === '') {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng nhập đầy đủ thông tin đăng nhập',
        });
    } else {
        userModel.handleLoginDataModel({ username, pass }, res);
    }
}

const handleToken = (req, res) => {
    userModel.updateToken(req.body, res);
}

const handleUserAccountDataByToken = (req, res) => {
    userModel.getUserAccountData(req.query, res);
}

const handleUserPersonDataByToken = (req, res) => {
    userModel.getUserPersonData(req.query, res);
}

const handleLogout = (req, res) => {
    userModel.resetToken(res);
}

const verifyEmail = (req, res) => {
    const email = req.body.email;
    if (email === '') {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng nhập email!',
        });
    } else {
        userModel.verifyEmailModel(email, res);
    }
}

const saveBusiness = async (req, res) => {
    try {
        const schema = Joi.object({
            userName: Joi.string().required(),
            image: Joi.binary().required(),
            phone: Joi.string().max(10).min(10).required(),
            email: Joi.string().email().required(),
            address: Joi.string().max(50).required(),
            establishDate: Joi.date().required(),
            industrySector: Joi.string().required(),
            representator: Joi.string().required(),
            shortDesc: Joi.string().required(),
        });
    
        const {error, value} = schema.validate(req.body);
        console.log(value);
    
        if (error) return res.status(400).json(error);

        const checkEmail = await userModel.checkEmail(value.email);
        if (checkEmail.length > 0) {
            console.log('email da ton tai:' + checkEmail);
            return res.status(401).json('Email này đã tồn tại!, vui lòng sử dụng email khác!');
        }

        const checkUserName = await userModel.checkUserName(value.userName);
        if (checkUserName.length > 0) {
            console.log('userName da ton tai: ' + checkUserName);
            return res.status(400).json('Tên đăng nhập này đã tồn tại, vui lòng sử dụng tên đăng nhập khác!');
        }
        const account = {
            userName: value.userName,
            pass: '123456',
            permissionsId: 4,
        }
    
        const person = {
            userName: value.userName,
            phone: value.phone,
            address: value.address,
            email: value.email,
            fullName: value.representator,
            image: value.image,
        }
    
        const result = await userModel.saveAccount(account);
        let resultSaveBusiness;
        console.log('account: ', result);
    
        if (result) {
            const resultSavePerson = await userModel.savePerson(person);
            console.log('person: ', resultSavePerson);
            const business = {
                establishDate: new Date(value.establishDate).toISOString().slice(0, 10),
                industrySector: value.industrySector,
                representator: value.representator,
                shortDesc: value.shortDesc,
                userId: resultSavePerson.insertId,
            }
            if (resultSavePerson) {
                resultSaveBusiness = await userModel.saveBusiness(business);
                console.log('business: ', resultSaveBusiness);
            }
        }
    
        if (!result) return res.status(500).json('error');
        const dataReturn = await userModel.getBusinessByBusinessId(resultSaveBusiness.insertId);

        return res.status(200).json(dataReturn[0]);
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({ detail: e.message });        
    }
}

const getBusinessController = (req, res) => {
    userModel.getBusinessModel(req, res);
}

const putBusinessController = (req, res) => {
    const data = req.body;
    const isExistedInvalidValue = Object.keys(data).some(item => data[item] === "" || data[item] === null)
    if (isExistedInvalidValue) {
        res.send({
            statusCode: 400,
            repsonseData: "Vui lòng nhập đầy đủ thông tin trước khi lưu thay đổi"
        })
    } else {
        userModel.putBusinessModel(data, res);
    }
}

module.exports = {
    handleLoginInput,
    handleToken,
    handleUserAccountDataByToken,
    handleUserPersonDataByToken,
    handleLogout,
    verifyEmail,
    saveBusiness,
    getBusinessController,
    putBusinessController,
    getUserInfo,
    updateUser,
    getStudent,
    updateStudent,
    getTeacher,
    updateTeacher,
}