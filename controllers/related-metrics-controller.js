module.exports = {
    setRelatedNFTLists, setRelatedTokenLists, getRelatedNFTHolderStats, getRelatedTokenHolderStats

};

async function setRelatedNFTLists(req,res){
    try {
        const { project, chain, force_update } = req.body
        if (!project && !chain) { throw { status:400, message: 'Bad Request' } }

        let related_holding = await RelatedHoldingMetrics.findOne({ project: project, type: 'nft' }).exec();
        let whales = await Whales.findOne({ project: project }).exec();
        
        if (!whales) {
            throw { status: 404, message: 'Data Not Found, Please check again your project name' }
        }

        let nfts = []
        if (related_holding && (related_holding.expires > new Date()) && !force_update){
            res.status(200).json({message: `related Nft for project ${project} is exists and updated`})
        } else if (!related_holding || (related_holding.expires < new Date()) || force_update){
            const expires = new Date(new Date().getTime() + config.relatedExpiringTime)
            const { data } = await axios.get(whales.url_data);
            const whale_addresses = data.map(wa => wa.ADDRESS)

            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("x-qn-api-version", "1");
            
            whale_addresses.forEach(async (wa,i) => {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("x-qn-api-version", "1");
                
                const raw = JSON.stringify({
                  "id": 67,
                  "jsonrpc": "2.0",
                  "method": "qn_fetchNFTs",
                  "params": {
                    "wallet": wa,
                    "omitFields": [
                      "provenance",
                      "traits"
                    ]
                  }
                });
                                    
                  
                  let requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                  };
                  
                  await fetch("https://solitary-hidden-frost.quiknode.pro/4059b0ac8d79afe22a0df17a8600ffe24fdb8269/", requestOptions)
                    .then(response => response.text())
                    .then(resp =>  {
                        const data_arr = JSON.parse(resp).result.assets
                        data_arr.forEach((data) => {
                            nfts.push(data['collectionName'])
                        })                            
                    })
                    .catch(error => console.log('error', error));
            })

            setTimeout(async() => {
                // save to db
                await RelatedHoldingMetrics.updateOne(
                    { project: project, type: "nft" },
                    {   
                        data: tokens,
                        expires: expires
                    },
                    {
                        upsert: true,
                    }
                ).exec();
                res.status(200).json({message: 'related NFT holder updated to new data'})
            }, 20000);

        } else {
            throw { status: 500, message: 'Something went error' }
        }
    } catch (error) {
        console.log(`Network Errror: `, error);
        res.status(500).json(`Network Errror: `, error)
    }
}

async function setRelatedTokenLists(req,res){
    try {
        const { project, chain, force_update } = req.body
        if (!project && !chain) { throw { status:400, message: 'Bad Request' } }

        let related_holding = await RelatedHoldingMetrics.findOne({ project: project, type: 'token' }).exec();
        let whales = await Whales.findOne({ project: project }).exec();
        
        if (!whales) {
            throw { status: 404, message: 'Data Not Found, Please check again your project name' }
        }

        let tokens = []
        if (related_holding && (related_holding.expires > new Date()) && !force_update){
            res.status(200).json({message: `related Token for project ${project} is exists and updated`})
        } else if (!related_holding || (related_holding.expires < new Date()) || force_update){
            const expires = new Date(new Date().getTime() + config.relatedExpiringTime)
            const { data } = await axios.get(whales.url_data);
            const whale_addresses = data.map(wa => wa.ADDRESS)

            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("x-qn-api-version", "1");
            
            whale_addresses.forEach(async (wa,i) => {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("x-qn-api-version", "1");
                let raw = JSON.stringify({
                    "id": 67,
                    "jsonrpc": "2.0",
                    "method": "qn_getWalletTokenBalance",
                    "params": {
                      "wallet": wa
                    }
                  });                                    
                  
                  let requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                  };
                  
                  await fetch("https://solitary-hidden-frost.quiknode.pro/4059b0ac8d79afe22a0df17a8600ffe24fdb8269/", requestOptions)
                    .then(response => response.text())
                    .then(resp =>  {
                        const data_arr = JSON.parse(resp).result.assets
                        data_arr.forEach((data) => {
                            tokens.push(Array(data['name'], data['amount']/Math.pow(10, data['decimals'])))
                        })                            
                    })
                    .catch(error => console.log('error', error));
            })

            setTimeout(async() => {
                // save to db
                await RelatedHoldingMetrics.updateOne(
                    { project: project, type: "nft" },
                    {   
                        data: tokens,
                        expires: expires
                    },
                    {
                        upsert: true,
                    }
                ).exec();
                res.status(200).json({message: 'related Token holder updated to new data'})
            }, 20000);

        } else {
            throw { status: 500, message: 'Something went error' }
        }
    } catch (error) {
        console.log(`Network Errror: `, error);
        res.status(500).json(`Network Errror: `, error)
    }
}


async function getRelatedNFTHolderStats(req,res){
    try {
        let related_holding = await RelatedHoldingMetrics.findOne({ project: req.params.project, type: 'nft' }).exec();
        if (related_holding && related_holding.expires > new Date()){
            let resultArr = Array(Array('KEYS','OCCURRENCE'));
            for (let i = 0; i < related_holding.data.length; i++) {
              let flag = true;
              for (let j = 0; j < resultArr.length; j++) {
                 if(resultArr[j][0] == related_holding.data[i]){
                   resultArr[j][1] = resultArr[j][1] + 1;
                   flag = false;
                  }
              }
              if(flag){
                resultArr.push(Array(related_holding.data[i],1));
              }
            }
            
            const output = resultArr.slice(1).map(nft => {if(nft[0] != '') return nft}).sort((a,b) => b[1] - a[1]).slice(0,10)
            const result = output.map(n => {
                const nftObj = {name: n[0], values:n[1]}
                return nftObj
            })
            res.status(200).json(result)
        } else if (!related_holding || (related_holding.expires < new Date())){
            res.status(500).json({message:'Data Error/Not Found/Expired'})
        } else {
            res.status(502).json({message:'Something went error'})
        }
    } catch (error) {
        console.log(`Network Errror: `, error);
        res.status(500).json(`Network Errror: `, error)
    }
}

async function getRelatedTokenHolderStats(req,res){
    try {
        let related_holding = await RelatedHoldingMetrics.findOne({ project: req.params.project, type: 'token' }).exec();

        if (related_holding && related_holding.expires > new Date()){
            let resultArr = Array(Array('MINT','TOTAL'));
            for (let i = 0; i < related_holding.data.length; i++) {
              let flag = true;
              for (let j = 0; j < resultArr.length; j++) {
                 if(resultArr[j][0] == related_holding.data[i][0]){
                   resultArr[j][1] = Number(resultArr[j][1]) + Number(related_holding.data[i][1]);
                   flag = false;
                 }
              }
              if(flag){
                resultArr.push(Array(related_holding.data[i][0],Number(related_holding.data[i][1])));
              }
            }

            const raw_output = resultArr.slice(1).sort((a,b) => b[1] - a[1])
            let result_filtered = []
            let result = raw_output.map(ft => {if(ft[0] != '') return ft})
            
            result.forEach(n => {
                if (n) {
                    const tokenObj = {name: n[0], values:n[1]}
                    result_filtered.push(tokenObj)
                }
            })

            result_filtered = result_filtered.slice(0,10)
            res.status(200).json(result_filtered)

        } else if (!related_holding || related_holding.expires < new Date()){
            res.status(500).json({message:'Data Error/Not Found/Expired'})
        } else {
            res.status(502).json({message:'Something went error'})
        }        
    } catch (error) {
        console.log(`Network Errror: `, error);
        res.status(500).json(`Network Errror: `, error)
    }
}