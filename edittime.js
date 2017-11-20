function GetPluginSettings()
{
  return {
    "name":      "Tin Can",
    "id":      "TinCan",
    "version":    "1.0",
    "description":  "Create a Tin Can object to communicate with LRS",
    "author":    "Warren Smith",
    "help url":    "www.scirra.com",
    "category":    "Data & Storage",
    "type":      "object",
    "rotatable":  false,
    "dependency": "tincan-min.js",
    "flags":    pf_singleglobal
  };
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])      // a number
// AddStringParam(label, description [, initial_string = "\"\""])    // a string
// AddAnyTypeParam(label, description [, initial_string = "0"])      // accepts either a number or string
// AddCmpParam(label, description)                    // combo with equal, not equal, less, etc.
// AddComboParamOption(text)                      // (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])      // a dropdown list parameter
// AddObjectParam(label, description)                  // a button to click and pick an object type
// AddLayerParam(label, description)                  // accepts either a layer number or name (string)
// AddLayoutParam(label, description)                  // a dropdown list with all project layouts
// AddKeybParam(label, description)                    // a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)                // a string intended to specify an animation name
// AddAudioFileParam(label, description)                // a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,          // any positive integer to uniquely identify this condition
//        flags,        // (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//                  // cf_deprecated, cf_incompatible_with_triggers, cf_looping
//        list_name,      // appears in event wizard list
//        category,      // category in event wizard list
//        display_str,    // as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//        description,    // appears in event wizard dialog when selected
//        script_name);    // corresponding runtime function name

// example
AddCondition(0, cf_none, "LRS Ready", "Tin Can", "LRS Ready", "True if LRS is connected.", "LRSReady");
AddCondition(1, cf_trigger, "On Statement", "Tin Can", "On statement", "Triggered after a statement is made and status is ready.", "OnStatement");

////////////////////////////////////////
// Actions

// AddAction(id,        // any positive integer to uniquely identify this action
//       flags,        // (see docs) af_none, af_deprecated
//       list_name,      // appears in event wizard list
//       category,      // category in event wizard list
//       display_str,    // as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//       description,    // appears in event wizard dialog when selected
//       script_name);    // corresponding runtime function name

// example
AddStringParam("LRS URL", "The address of the LRS to connect" ,"");
AddStringParam("LRS Username", "The name of the user to connect" ,"");
AddStringParam("LRS Password", "The password to connect" ,"");
AddAction(0, af_none, "Connect LRS (parms)", "Tin Can", "Connect to the LRS: {0},{1},{2}", "Connects user to the LRS", "ConnectLRSparms");
AddAction(1, af_none, "Connect LRS", "Tin Can", "Connect to the LRS", "Connects user to the LRS", "ConnectLRS");
AddStringParam("Tin Actor name", "Name of actor for the statement" ,"");
AddStringParam("Tin Actor email", "Mailbox of actor for the statement" ,"");
AddStringParam("Tin Verb", "The actor's action" ,"");
AddStringParam("Tin Object name", "Name of target of the action" ,"");
AddStringParam("Tin Object id", "URI of target of the action" ,"");
AddAction(2, af_none, "Make Statement", "Tin Can", "Make this statement: {0},{1},{2},{3},{4}", "Make a Tin Can statement", "MakeTinStatement");
AddStringParam("Tin statement language", "Language code for statement descriptors", "");
AddAction(3, af_none, "Set Language", "Tin Can", "Set this language: {0}", "Set statement language", "SetTinLanguage");

////////////////////////////////////////
// Expressions

// AddExpression(id,      // any positive integer to uniquely identify this expression
//         flags,      // (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//                // ef_return_any, ef_variadic_parameters (one return flag must be specified)
//         list_name,    // currently ignored, but set as if appeared in event wizard
//         category,    // category in expressions panel
//         exp_name,    // the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//         description);  // description in expressions panel

// example
AddExpression(0, ef_return_string, "", "Tin Can", "LRSEndpoint", "Get the Endpoint URL for the LRS.");
AddExpression(1, ef_return_string, "", "Tin Can", "LRSUser", "Get the current user for the LRS.");
AddExpression(2, ef_return_string, "", "Tin Can", "TinResult", "Get the text result of last Tin Can call.");
AddExpression(3, ef_return_number, "", "Tin Can", "TinErr", "Get the error code for the last Tin Can call.");
AddExpression(4, ef_return_number, "", "Tin Can", "TinCode", "Get the result code for the last Tin Can call.");
AddExpression(5, ef_return_string, "", "Tin Can", "TinLanguage", "Get the language code for Tin Can statements.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,    name,  initial_value,  description)    // an integer value
// new cr.Property(ept_float,    name,  initial_value,  description)    // a float value
// new cr.Property(ept_text,    name,  initial_value,  description)    // a string
// new cr.Property(ept_color,    name,  initial_value,  description)    // a color dropdown
// new cr.Property(ept_font,    name,  "Arial,-16",   description)    // a font with the given face name and size
// new cr.Property(ept_combo,    name,  "Item 1",    description, "Item 1|Item 2|Item 3")  // a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,    name,  link_text,    description, "firstonly")    // has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
  new cr.Property(ept_text,   "LRSEndpoint",    "",    "LRS access point"),
  new cr.Property(ept_text,   "LRSUser",    "",    "Username for LRS"),
  new cr.Property(ept_text,   "LRSPassword",    "",    "Password for LRS"),
  new cr.Property(ept_integer,   "LRSCanFail",    0,    "True to prevent LRS silent failures"),
  new cr.Property(ept_text,   "TinCanLanguage",    "en-GB",    "Language code for Tin Can statements"),
  new cr.Property(ept_text,   "VerbRepository",    "http://adlnet.gov/expapi/verbs/",    "URL of repository for verbs")
  ];

// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
  return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
  assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
  return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
  assert2(this instanceof arguments.callee, "Constructor called as a function");

  // Save the constructor parameters
  this.instance = instance;
  this.type = type;

  // Set the default property values from the property table
  this.properties = {};

  for (var i = 0; i < property_list.length; i++)
    this.properties[property_list[i].name] = property_list[i].initial_value;

  // Plugin-specific variables
  // this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}