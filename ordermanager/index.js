var senecaEmailer=require("seneca")().client({host:"192.168.225.161",port:"8080"});
var plugin=function(options)
{
    var seneca=this;
    seneca.add({area:"orders",action:"fetch"},function(args,done)
    {
      var orders=this.make("orders");
      orders.list$({},done);
    })

    .add({area:"orders",action:"create"},function(args,done)
    {
        var produits=args.produits;
        var total=0.0;
        produits.forEach(function(element) {
           total+=element.price; 
        });
        var order=this.make("orders");
        order.total=total;
        order.customer_email=args.email;
        order.customer_name=args.name;
        order.save$(function(err,order)
        {
           var pattern={
               area:"email",
               action:"send",
               template:"new_order",
               to:args.email,
               name:args.name
           }
           senecaEmailer.act(pattern,done);
        })
        
    })
}
module.exports=plugin;