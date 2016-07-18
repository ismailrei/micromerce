var plugin=function(options)
{
    var seneca=this;
    //la liste des produits: 
    seneca.add({area:"produit",action:"fetch"},function(args,done)
    {
        var produits=this.make("produits");
        produits.list$({},done);
    })
    //recherche par categorie
    .add({area:"produit",action:"fetch",criteria:"categoryId"},function(args,done)
    {
        var produits=this.make("produits");
        produits.list$({category:args.category},done);//return list
    })
    //recherche par id
    .add({area:"produit",action:"fetch",criteria:"byId"},function(args,done)
    {
        var produits=this.make("produits");
        produits.load$(args.id,done);//return one element
    })
    //add a product
    .add({area:"produit",action:"add"},function(args,done)
    {
        var produit=this.make("produits");
        produit.category=args.category;
        produit.name=args.name;
        produit.description=args.category;
        produit.price=args.price;
        produit.save$(function(err,produit)
        {
            done(err,produits.data$(false));
        });

    })
    //delete a product
    .add({area:"produit",action:"delete"},function(args,done)
    {
        var produit=this.make("produits");
        produit.remove$(args.id,function(err)
        {
            done(err,null);
        });
    })
    //edit a product
    .add({area:"produit",action:"edit"},function(args,done)
    {
        seneca.act({area:"produit",action:"edit",criteria:"buId",id:args.id},function(err,reponse)
        {
            reponse.data$(
                {
                    name:args.name,
                    category:agrs.category,
                    description:args.description,
                    price:args.price
                }
            );
            reponse.save$(function(err,product)
            {
                done(product.data$(false));
            });
        });
    });
}
module.exports=plugin;

var seneca=require("seneca")();
seneca.use(plugin)
      .use("mongo-store",{
        name:"seneca",
        host:"127.0.0.1",
        port:"27017"
    })
      .ready(function(err){
          seneca.act('role:web',{use:{//execute the role web action
              prefix:'/produits',//use /produits prefix for all the urls
              pin:{area:'produit',action:'*'},//ie for example /produits/fetch endpoint will correspond to the {area:"produit",action:"fetch"}
              map:{
                  fetch:{GET:true},
                  edit:{PUT:true},
                  delete:{GET:false,DELETE:true}
              }
          }});
          var app=require("express")();
          app.use(require("body-parser").json())
             .use(seneca.export('web'))
             .listen(3000);
    });
