const TokenLists = require('../models/token_list');

module.exports = {
    getAll, addData
};

async function getAll(req,res){
    try {
        const token_lists = await TokenLists.find().exec();

        if (!token_lists.length){
            throw { status:500, message: 'Internal Error' }
        } else {
            res.status(200).json(token_lists)
        }
    } catch (error) {
        console.log(`Network Errror: `, error);
        res.status(500).json(error)
    }
}

async function addData(req,res){
    try {
        const { name, mint, symbol, icon } = req.body
        if (!mint) {
            throw {status:400, message: 'Bad Request'}
        } else {            
            await TokenLists.updateOne(
                { token_mint: mint },
                {
                  token_name: name?name:'Unknown Token',
                  token_symbol: symbol?symbol:'-',
                  token_icon: icon?icon:'-'
                },
                {
                    upsert: true,
                }
              ).exec();
              let token = await TokenLists.findOne({
                  token_mint: mint
              }).exec();
              return res.status(200).json(token);                      
        }
    } catch (error) {
        console.log(`Network Errror: `, error);
        res.status(500).json(error)
    }
}
