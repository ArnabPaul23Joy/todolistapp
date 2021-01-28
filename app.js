const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const _=require("lodash")
// const date=require(__dirname+"/date.js")
const mongoose=require("mongoose")
const conLink="mongodb+srv://admin-Arnab:2223@paj@cluster0.k3e8q.mongodb.net/test?retryWrites=true&w=majority/todolistDB"
// "mongodb+srv://admin-Arnab:2223@paj@cluster0.k3e8q.mongodb.net/todolistDB?retryWrites=true&w=majority/todolistDB"
// "mongodb://localhost:27017/todolistDB"
mongoose.connect(conLink,{useNewUrlParser:true})

// const items=[];//you can do push operation in const arrays, but can't assign a new array to item
// const workItems=[];//you can do push operation in const arrays, but can't assign a new array to workItems

const itemSchema={
    name:String
}
const itemTypeSchema={
    name: String,
    items: [itemSchema]
}
const Item=mongoose.model("Item",itemSchema)
const ItemType=mongoose.model("ItemType",itemTypeSchema)

const item1=new Item({
    name: "welcome"
}) 
const item2=new Item({
    name: "hit + to add a new item"
})
const item3=new Item({
    name: "<-- hit this to delete an item"
})
const defaultItems=[item1,item2,item3]

// let lItem=""

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var days=["Sun","Mon","Tues","Wed","Thu","Fri","Sat"]
app.get("/",function(req,res){
    // var day="Today"
    res.redirect("/Today")
})
app.get("/:listType",function(req,res){
    let lType=req.params.listType
    // const nItem=new Item({
    //     name: req.body.newItem,
    //     type_od_todo:req
    // })
    lType=_.capitalize(lType)
    const listType=new ItemType({
        name: lType,
        items: defaultItems
    })
    var flags=true
    ItemType.findOne({name: lType},function(err,result){
        if(!err){
            if(!result){
                listType.save()
                console.log(defaultItems)
                res.render("list",{listTitle:lType, newListItem:defaultItems})
                flags=false
            }
            else{
                res.render("list",{listTitle: result.name, newListItem: result.items}) 
            }
        }
    })
    // if(!flags){
    // }
})
app.post("/checkBox",function(req,res){
    const ttttt=req.body.Title_heading
    const indx=req.body.cBox
    console.log("just the req  "+indx+"  "+ttttt)
    ItemType.findOneAndUpdate({name: ttttt},{$pull: {items: {_id: indx}}},function(err,result){
        if(err){
            console.log(err)
        }
    })
    res.redirect("/"+ttttt)
    // Item.findByIdAndRemove(req.body.checkBox,function(err){
    //     if(err){
    //         console.log(err)
    //     }
    //     else{
    //         console.log("Delete successful")
    //     }
    // })
    
    // Item.deleteOne({_id:req.body.checkBox},function(err){
    //     if(err){
    //         console.log(err)
    //     }
    //     else{
    //         console.log("Delete successful")
    //     }
    // })
    // res.redirect("/")
})
app.post("/",function(req,res){
    const listT=req.body.list
    console.log("askdkhgasgd asd as "+req.body.list)
    const nItem=new Item({
        name: req.body.newItem
    })
    // nItem.save()
    var tempRes=[]
    ItemType.findOneAndUpdate({name: listT},{$push: {items: nItem}},function(err,result){
        if(err){
            console.log(err)
        }
    })
    // ItemType.findOne({name: listT},function(err,result){
    //     if(!err){
    //         result.items.push(nItem)
    //         result.save()
    //     }
    //     else{
    //         console.log(err)
    //     }
    // })
    // tempRes.push(nItem)
    // console.log("asjhdkjashd   "+tempRes)
    // ItemType.updateOne({name: listT},{items: tempRes},function(err){
    //     if(!err){
    //         console.log("updatedddd")
    //     }
    // })
    res.redirect("/"+listT)
    // if(req.body.list=="Work"){
    //     workItems.push();
    //     console.log(workItems);
    //     res.redirect("/work")
    // }
    // else{
    //     items.push(req.body.newItem);
    //     res.redirect("/");
    // }
    // console.log(item);    
})
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
// app.listen(3000,function(){
//     console.log("server started on port 3000");
// })
