
const home=function(req,res,next){

    res.status(200).json({
        status:"success",
        message:"API is running successfully.Please enter endpoints to get results.For endpoints you can refer my github Readme\nGithub Repo Link: https://github.com/saurabhs402/Cinema-Vault"
    })
}

module.exports={home}