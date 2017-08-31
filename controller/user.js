/**
 * Created by guosen on 2017/8/18.
 */
const User= require('../services/User');
const jwt = require('jsonwebtoken');
const secret =  require('../config.json').secret;
module.exports = {
    create: async (req,res,next) => {
        try {
            const from = req.body;
            const result = await User.create(from);
            res.send({status:'success'});
        }catch (e){
            res.statusCode=422;
            res.json({message:e.message});
        }
    },
    login: async (req, res, next) => {
        try {
            const params= req.body;
            const result = await User.login(params);
            const token = jwt.sign({id:result.id},secret);
            console.log('token:',token);
            res.cookie('token',token,{signed:true,httpOnly:true});
            res.send({status:'success',token:token});
        }catch (e){
            res.statusCode= 422;
            res.json({message:e.message});
        }
    },
    findById: async (req, res, next) => {
        if(req.user){
            try {
                const user = JSON.parse(JSON.stringify(req.user));
                delete user.password;
                res.send(user);
            }catch (e){
                res.statusCode=401;
                res.send({code:401,message:'please login'})
            }
        }else{
            res.statusCode=401;
            res.send({code:401,message:'please login'})
        }
    },
    setRole: async (req, res, next) => {
        try {
            const params= req.query;
            if(params.userId && params.roleId){
                try {
                    const result = await User.setRole(params.userId, params.roleId);
                    res.send({status:'success'});
                }catch (e){
                    res.statusCode=422;
                    res.send(e);
                }

            }else{
                res.statusCode=422;
                res.end({code:422,message:'userId and roleId is required'})
            }
        }catch (e){
            res.statusCode= 422;
            res.json({message:e.message});
        }
    },
    removeRole: async (req, res, next) => {
        try {
            const params= req.query;
            if(params.userId && params.roleId){
                try {
                    const result = await User.removeRole(params.userId, params.roleId);
                    res.send({status:'success'});
                }catch (e){
                    res.statusCode=422;
                    res.send(e);
                }

            }else{
                res.statusCode=422;
                res.end({code:422,message:'userId and roleId is required'})
            }
        }catch (e){
            res.statusCode= 422;
            res.json({message:e.message});
        }
    },
}