var senecaEmailer=require("seneca")().client({
    host:"192.168.225.161",
    port:"8080"
});
var senecaProduct=require("seneca")().client({
    host:"192.168.225.162",
    port:"8080"
});
var senecaOrder=require("seneca")().client({
    host:"192.168.225.163",
    host:"8080"
});

var api=function(options){
    var seneca=this;
    seneca.add({area:"UI",action:"product"},function(args,done)
    {
        senecaProduct.act({area:"produit",action:"fetch"},function(err,result)
        {
            done(err,result);
        });
    })
        .add({area:"UI",action:"productById"},function(args,done){
            seneca.act({area:"produit",action:"fetch",criteria:"byId",id:args.id},function(err,result)
            {
                done(err,result);
            });
        })
        .add({area:"UI",action:"createOrder"},function(args,done)
        {
            seneca.act({area:"produit",action:"fetch",criteria:"byId",id:args.id},function(err,product)
            {
                if(err) done(err,null);
                senecaOrder.act({area:"order",action:"create",product:[product],email:args.email,name:args.name},function(err,order)
                {
                    done(err,order);
                });
            });
        });
        seneca.add("init:api",function(msg,respond)
        {
            seneca.act('role:web',{use:{
                prefix:"/api",
                pin:{area:"UI",action:"*"},
                map:{
                    product:{GET:true}
                    productById:{GET:true,suffix:'/:id'}
                    createOrder:{POST:true}
                }
            }},respond)
        });
}
module.exports=api;
var app=require("express")();
var bodyParser=require("body-parser");
var seneca=require("seneca")();
app.use(bodyParser.json());
   .use(seneca.export("web"));
   .listen(3000);

