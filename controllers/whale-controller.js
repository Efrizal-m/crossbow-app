const Whales = require('../models/whale');
const axios = require('axios')

module.exports = {
    getMetrics
};

async function getMetrics(req,res){
    try {
        let metrics = await Whales.findOne({ project: req.params.project, type: 'token' }).exec();
        if (!metrics){
            res.status(404).json({message:'Data Error/Not Found/Expired'})
        } else {
            const { data } = await axios.get(metrics.url_data);
            res.status(200).json(data)
        }        
    } catch (error) {
        console.log(`Network Errror: `, error);
        res.status(500).json(error)
    }
}