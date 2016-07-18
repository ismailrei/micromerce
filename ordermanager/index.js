var plugin=function(options)
{
    var seneca=this;
    seneca.add({area:"orders",action:"fetch"},function(args,done)
    {
      var orders=this.make("orders");
      orders.list$({},done);
    })
}