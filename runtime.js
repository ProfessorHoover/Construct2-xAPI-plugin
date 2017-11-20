// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.TinCan = function(runtime)
{
  this.runtime = runtime;
};

(function ()
{
  var pluginProto = cr.plugins_.TinCan.prototype;

  /////////////////////////////////////
  // Object type class
  pluginProto.Type = function(plugin)
  {
    this.plugin = plugin;
    this.runtime = plugin.runtime;
  };

  var typeProto = pluginProto.Type.prototype;

  // called on startup for each object type
  typeProto.onCreate = function()
  {
  };

  var self = null;
  var lrs = null;
  var lrsendpt = "";
  var lrsusername = "";
  var lrspassword = "";
  var lrscanfail = false;
  var tinretmsg = "";
  var tinlanguage = "";
  var tinverbrepo = "";
  var tinretcode = 0;
  var tinerrcode = 0;

  /////////////////////////////////////
  // Instance class
  pluginProto.Instance = function(type)
  {
    this.type = type;
    this.runtime = type.runtime;
  };

  var instanceProto = pluginProto.Instance.prototype;

  // called whenever an instance is created
  instanceProto.onCreate = function()
  {
    self = this;

    lrsendpt = this.properties[0];
    lrsusername = this.properties[1];
    lrspassword = this.properties[2];
    lrscanfail = this.properties[3];
    tinlanguage = this.properties[4];
    tinverbrepo = this.properties[5];
  };

  // called whenever an instance is destroyed
  // note the runtime may keep the object after this call for recycling; be sure
  // to release/recycle/reset any references to other objects in this function.
  instanceProto.onDestroy = function ()
  {
     if (lrs != null)
        lrs = null;
  };

  // called when saving the full state of the game
  instanceProto.saveToJSON = function ()
  {
    // return a Javascript object containing information about your object's state
    // note you MUST use double-quote syntax (e.g. "property": value) to prevent
    // Closure Compiler renaming and breaking the save format
    return {
      // e.g.
      //"myValue": this.myValue
    };
  };

  // called when loading the full state of the game
  instanceProto.loadFromJSON = function (o)
  {
    // load from the state previously saved by saveToJSON
    // 'o' provides the same object that you saved, e.g.
    // this.myValue = o["myValue"];
    // note you MUST use double-quote syntax (e.g. o["property"]) to prevent
    // Closure Compiler renaming and breaking the save format
  };

  // only called if a layout object - draw to a canvas 2D context
  instanceProto.draw = function(ctx)
  {
  };

  // only called if a layout object in WebGL mode - draw to the WebGL context
  // 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
  // directory or just copy what other plugins do.
  instanceProto.drawGL = function (glw)
  {
  };

  // The comments around these functions ensure they are removed when exporting, since the
  // debugger code is no longer relevant after publishing.
  /**BEGIN-PREVIEWONLY**/
  instanceProto.getDebuggerValues = function (propsections)
  {
    // Append to propsections any debugger sections you want to appear.
    // Each section is an object with two members: "title" and "properties".
    // "properties" is an array of individual debugger properties to display
    // with their name and value, and some other optional settings.
    propsections.push({
      "title": "My debugger section",
      "properties": [
        // Each property entry can use the following values:
        // "name" (required): name of the property (must be unique within this section)
        // "value" (required): a boolean, number or string for the value
        // "html" (optional, default false): set to true to interpret the name and value
        //                   as HTML strings rather than simple plain text
        // "readonly" (optional, default false): set to true to disable editing the property

        // Example:
        // {"name": "My property", "value": this.myValue}
      ]
    });
  };

  instanceProto.onDebugValueEdited = function (header, name, value)
  {
    // Called when a non-readonly property has been edited in the debugger. Usually you only
    // will need 'name' (the property name) and 'value', but you can also use 'header' (the
    // header title for the section) to distinguish properties with the same name.
    if (name === "My property")
      this.myProperty = value;
  };
  /**END-PREVIEWONLY**/

  //////////////////////////////////////
  // Conditions
  function Cnds() {};

  // OnStatement trigger
  Cnds.prototype.OnStatement = function ()
  {
    return true;
  };

  // check if LRS connection is established
  Cnds.prototype.LRSReady = function ()
  {
     if (lrs == null)
        return false;
     else
        return true;
  };

  // ... other conditions here ...

  pluginProto.cnds = new Cnds();

  //////////////////////////////////////
  // Actions
  function Acts() {};

  // connect to the LRS with preset (editor) parameters
  Acts.prototype.ConnectLRS = function ()
  {
    try {
    lrs = new TinCan.LRS(
        {
            endpoint: lrsendpt,
            username: lrsusername,
            password: lrspassword,
            allowFail: lrscanfail
        }
    );
    console.log("LRS connection successful!");
   }
   catch (ex) {
      lrs = null;
      console.log("failed to connect to LRS", ex);
   }
   if (lrs != null){
       console.log(lrs);
   }
  };

  // connect to the LRS with parameters
  Acts.prototype.ConnectLRSparms = function (link,user,pass)
  {
    try {
    lrs = new TinCan.LRS(
        {
            endpoint: link,
            username: user,
            password: pass,
            allowFail: lrscanfail
        }
    );
   }
   catch (ex) {
      lrs = "LRS connection failed";
   }
  };

  // create statementstatement for the LRS
  Acts.prototype.MakeTinStatement = function (tcactorname,tcactormail,tcverb,tctargetname,tctargetid)
  {
     if (lrs != null) {
        tinerrcode = 0;
        tinretcode = 0;
        tinretmsg = "";

        var tcstatement = new TinCan.Statement(
           {
              actor: {
                 name: tcactorname,
                 mbox: tcactormail
              },
              verb: {
                 id: tinverbrepo + tcverb
              },
              target: {
                 id: tctargetid + tctargetname
              }
          }
        );

        lrs.saveStatement(
           tcstatement,
        {
        callback: function (err, xhr) {
           if (err !== null) {
              if (xhr !== null) {
                 tinretmsg = xhr.responseText;
                 tinretcode = xhr.status;
                 tcstatement = null;
                 self.runtime.trigger(cr.plugins_.TinCan.prototype.cnds.OnStatement, self);
                 return;
                }

                tinerrcode = err;
                tcstatement = null;
                self.runtime.trigger(cr.plugins_.TinCan.prototype.cnds.OnStatement, self);
                return;
              }

        tinretmsg = "Statement saved";
        tcstatement = null;
        self.runtime.trigger(cr.plugins_.TinCan.prototype.cnds.OnStatement, self);
           }
        }
        );
     }
  };

  // change language for Tin Can statements
  Acts.prototype.SetTinLanguage = function (tclanguage)
  {
     tinlanguage = tclanguage;
  };

  // ... other actions here ...

  pluginProto.acts = new Acts();

  //////////////////////////////////////
  // Expressions
  function Exps() {};

  // returns LRS URL
  Exps.prototype.LRSEndpoint = function (ret)  // 'ret' must always be the first parameter - always return the expression's result through it!
  {
    ret.set_string(lrsendpt);
  };

  // returns current LRS user
  Exps.prototype.LRSUser = function (ret)
  {
    ret.set_string(lrsusername);
  };

  // returns verbal result of last TinCan operation
  Exps.prototype.TinResult = function (ret)
  {
    ret.set_string(tinretmsg);
  };

  // returns error code of last TinCan operation
  Exps.prototype.TinErr = function (ret)
  {
    ret.set_int(tinerrcode);
  };

  // returns code of last TinCan operation
  Exps.prototype.TinCode = function (ret)
  {
    ret.set_int(tinretcode);
  };

  // returns language code setting
  Exps.prototype.TinLanguage = function (ret)
  {
    ret.set_string(tinlanguage);
  };

  // ... other expressions here ...

  pluginProto.exps = new Exps();

}());