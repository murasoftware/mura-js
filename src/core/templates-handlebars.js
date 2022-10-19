function attach(Mura){
  Mura["templates"] = Mura["templates"] || {};
  
  Mura["templates"]["checkbox_static"] = Mura.Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"summary") || (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"summary","hash":{},"data":data,"loc":{"start":{"line":4,"column":18},"end":{"line":4,"column":29}}}) : helper)));
  },"3":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data,"loc":{"start":{"line":4,"column":37},"end":{"line":4,"column":46}}}) : helper)));
  },"5":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return " <ins>"
      + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"formRequiredLabel") || (depth0 != null ? lookupProperty(depth0,"formRequiredLabel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"formRequiredLabel","hash":{},"data":data,"loc":{"start":{"line":4,"column":77},"end":{"line":4,"column":98}}}) : helper)))
      + "</ins>";
  },"7":function(container,depth0,helpers,partials,data) {
      return "</br>";
  },"9":function(container,depth0,helpers,partials,data,blockParams,depths) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "			<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"checkboxWrapperClass") || (depth0 != null ? lookupProperty(depth0,"checkboxWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"checkboxWrapperClass","hash":{},"data":data,"loc":{"start":{"line":8,"column":15},"end":{"line":8,"column":41}}}) : helper))) != null ? stack1 : "")
      + "\">\r\n				<input type=\"checkbox\" name=\""
      + alias4(container.lambda((depths[1] != null ? lookupProperty(depths[1],"name") : depths[1]), depth0))
      + "\" class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"checkboxClass") || (depth0 != null ? lookupProperty(depth0,"checkboxClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"checkboxClass","hash":{},"data":data,"loc":{"start":{"line":9,"column":53},"end":{"line":9,"column":72}}}) : helper))) != null ? stack1 : "")
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"datarecordid") || (depth0 != null ? lookupProperty(depth0,"datarecordid") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"datarecordid","hash":{},"data":data,"loc":{"start":{"line":9,"column":84},"end":{"line":9,"column":100}}}) : helper)))
      + "\" value=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":9,"column":109},"end":{"line":9,"column":118}}}) : helper)))
      + "\" "
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isselected") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":120},"end":{"line":9,"column":163}}})) != null ? stack1 : "")
      + "/>\r\n				<label class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"checkboxLabelClass") || (depth0 != null ? lookupProperty(depth0,"checkboxLabelClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"checkboxLabelClass","hash":{},"data":data,"loc":{"start":{"line":10,"column":18},"end":{"line":10,"column":42}}}) : helper))) != null ? stack1 : "")
      + "\" for=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"datarecordid") || (depth0 != null ? lookupProperty(depth0,"datarecordid") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"datarecordid","hash":{},"data":data,"loc":{"start":{"line":10,"column":55},"end":{"line":10,"column":71}}}) : helper)))
      + "\">"
      + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":10,"column":73},"end":{"line":10,"column":82}}}) : helper)))
      + "</label>\r\n			</div>\r\n";
  },"10":function(container,depth0,helpers,partials,data) {
      return " checked='checked'";
  },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"inputWrapperClass") || (depth0 != null ? lookupProperty(depth0,"inputWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputWrapperClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":35}}}) : helper))) != null ? stack1 : "")
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":47},"end":{"line":1,"column":55}}}) : helper)))
      + "-container\">\r\n	<div class=\"mura-checkbox-group\">\r\n		<label class=\"mura-group-label\" for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":3,"column":39},"end":{"line":3,"column":47}}}) : helper)))
      + "\">\r\n			"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(3, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":4,"column":3},"end":{"line":4,"column":53}}})) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":53},"end":{"line":4,"column":111}}})) != null ? stack1 : "")
      + "\r\n		</label>\r\n		"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":29}}})) != null ? stack1 : "")
      + "\r\n"
      + ((stack1 = (lookupProperty(helpers,"eachStatic")||(depth0 && lookupProperty(depth0,"eachStatic"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"dataset") : depth0),{"name":"eachStatic","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":2},"end":{"line":12,"column":17}}})) != null ? stack1 : "")
      + "	</div>\r\n</div>\r\n";
  },"useData":true,"useDepths":true});
  
  Mura["templates"]["checkbox"] = Mura.Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"summary") || (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"summary","hash":{},"data":data,"loc":{"start":{"line":4,"column":18},"end":{"line":4,"column":29}}}) : helper)));
  },"3":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data,"loc":{"start":{"line":4,"column":37},"end":{"line":4,"column":46}}}) : helper)));
  },"5":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return " <ins>"
      + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"formRequiredLabel") || (depth0 != null ? lookupProperty(depth0,"formRequiredLabel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"formRequiredLabel","hash":{},"data":data,"loc":{"start":{"line":4,"column":77},"end":{"line":4,"column":98}}}) : helper)))
      + "</ins>";
  },"7":function(container,depth0,helpers,partials,data) {
      return "</br>";
  },"9":function(container,depth0,helpers,partials,data,blockParams,depths) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.lambda, alias5=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "			<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"checkboxWrapperClass") || (depth0 != null ? lookupProperty(depth0,"checkboxWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"checkboxWrapperClass","hash":{},"data":data,"loc":{"start":{"line":8,"column":15},"end":{"line":8,"column":41}}}) : helper))) != null ? stack1 : "")
      + "\">\r\n				<input source=\""
      + alias5(alias4(((stack1 = (depths[1] != null ? lookupProperty(depths[1],"dataset") : depths[1])) != null ? lookupProperty(stack1,"source") : stack1), depth0))
      + "\" class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"checkboxClass") || (depth0 != null ? lookupProperty(depth0,"checkboxClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"checkboxClass","hash":{},"data":data,"loc":{"start":{"line":9,"column":49},"end":{"line":9,"column":68}}}) : helper))) != null ? stack1 : "")
      + "\" type=\"checkbox\" name=\""
      + alias5(alias4((depths[1] != null ? lookupProperty(depths[1],"name") : depths[1]), depth0))
      + "\" id=\"field-"
      + alias5(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":9,"column":115},"end":{"line":9,"column":121}}}) : helper)))
      + "\" value=\""
      + alias5(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":9,"column":130},"end":{"line":9,"column":136}}}) : helper)))
      + "\" "
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isselected") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":138},"end":{"line":9,"column":180}}})) != null ? stack1 : "")
      + "/>\r\n				<label class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"checkboxLabelClass") || (depth0 != null ? lookupProperty(depth0,"checkboxLabelClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"checkboxLabelClass","hash":{},"data":data,"loc":{"start":{"line":10,"column":18},"end":{"line":10,"column":42}}}) : helper))) != null ? stack1 : "")
      + "\" for=\"field-"
      + alias5(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":10,"column":55},"end":{"line":10,"column":61}}}) : helper)))
      + "\">"
      + alias5(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":10,"column":63},"end":{"line":10,"column":72}}}) : helper)))
      + "</label>\r\n			</div>\r\n";
  },"10":function(container,depth0,helpers,partials,data) {
      return "checked='checked'";
  },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"inputWrapperClass") || (depth0 != null ? lookupProperty(depth0,"inputWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputWrapperClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":35}}}) : helper))) != null ? stack1 : "")
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":47},"end":{"line":1,"column":55}}}) : helper)))
      + "-container\">\r\n	<div class=\"mura-checkbox-group\">\r\n		<label class=\"mura-group-label\" for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":3,"column":39},"end":{"line":3,"column":47}}}) : helper)))
      + "\">\r\n			"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(3, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":4,"column":3},"end":{"line":4,"column":53}}})) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":53},"end":{"line":4,"column":111}}})) != null ? stack1 : "")
      + "\r\n		</label>\r\n		"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":29}}})) != null ? stack1 : "")
      + "\r\n"
      + ((stack1 = (lookupProperty(helpers,"eachCheck")||(depth0 && lookupProperty(depth0,"eachCheck"))||alias2).call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"dataset") : depth0)) != null ? lookupProperty(stack1,"options") : stack1),(depth0 != null ? lookupProperty(depth0,"selected") : depth0),{"name":"eachCheck","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":2},"end":{"line":12,"column":16}}})) != null ? stack1 : "")
      + "	</div>\r\n</div>\r\n";
  },"useData":true,"useDepths":true});
  
  Mura["templates"]["dropdown_static"] = Mura.Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"summary") || (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"summary","hash":{},"data":data,"loc":{"start":{"line":2,"column":68},"end":{"line":2,"column":79}}}) : helper)));
  },"3":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data,"loc":{"start":{"line":2,"column":87},"end":{"line":2,"column":96}}}) : helper)));
  },"5":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return " <ins>"
      + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"formRequiredLabel") || (depth0 != null ? lookupProperty(depth0,"formRequiredLabel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"formRequiredLabel","hash":{},"data":data,"loc":{"start":{"line":2,"column":127},"end":{"line":2,"column":148}}}) : helper)))
      + "</ins>";
  },"7":function(container,depth0,helpers,partials,data) {
      return "</br>";
  },"9":function(container,depth0,helpers,partials,data) {
      return " aria-required=\"true\"";
  },"11":function(container,depth0,helpers,partials,data) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "				<option data-isother=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"isother") || (depth0 != null ? lookupProperty(depth0,"isother") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"isother","hash":{},"data":data,"loc":{"start":{"line":6,"column":26},"end":{"line":6,"column":37}}}) : helper)))
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"datarecordid") || (depth0 != null ? lookupProperty(depth0,"datarecordid") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"datarecordid","hash":{},"data":data,"loc":{"start":{"line":6,"column":49},"end":{"line":6,"column":65}}}) : helper)))
      + "\" value=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":6,"column":74},"end":{"line":6,"column":83}}}) : helper)))
      + "\" "
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isselected") : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":85},"end":{"line":6,"column":129}}})) != null ? stack1 : "")
      + ">"
      + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":6,"column":130},"end":{"line":6,"column":139}}}) : helper)))
      + "</option>\n";
  },"12":function(container,depth0,helpers,partials,data) {
      return "selected='selected'";
  },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "	<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"inputWrapperClass") || (depth0 != null ? lookupProperty(depth0,"inputWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputWrapperClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":36}}}) : helper))) != null ? stack1 : "")
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":48},"end":{"line":1,"column":56}}}) : helper)))
      + "-container\">\n		<label for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"labelForValue") || (depth0 != null ? lookupProperty(depth0,"labelForValue") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"labelForValue","hash":{},"data":data,"loc":{"start":{"line":2,"column":14},"end":{"line":2,"column":31}}}) : helper)))
      + "\" data-for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":43},"end":{"line":2,"column":51}}}) : helper)))
      + "\">"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":2,"column":53},"end":{"line":2,"column":103}}})) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":103},"end":{"line":2,"column":161}}})) != null ? stack1 : "")
      + "</label>\n		"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":29}}})) != null ? stack1 : "")
      + "\n		<select "
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"commonInputAttributes") || (depth0 != null ? lookupProperty(depth0,"commonInputAttributes") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"commonInputAttributes","hash":{},"data":data,"loc":{"start":{"line":4,"column":10},"end":{"line":4,"column":37}}}) : helper))) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":37},"end":{"line":4,"column":83}}})) != null ? stack1 : "")
      + ">\n"
      + ((stack1 = (lookupProperty(helpers,"eachStatic")||(depth0 && lookupProperty(depth0,"eachStatic"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"dataset") : depth0),{"name":"eachStatic","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":3},"end":{"line":7,"column":18}}})) != null ? stack1 : "")
      + "		</select>\n	</div>\n";
  },"useData":true});
  
  Mura["templates"]["dropdown"] = Mura.Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      return " aria-required=\"true\"";
  },"3":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"summary") || (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"summary","hash":{},"data":data,"loc":{"start":{"line":2,"column":114},"end":{"line":2,"column":125}}}) : helper)));
  },"5":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data,"loc":{"start":{"line":2,"column":133},"end":{"line":2,"column":142}}}) : helper)));
  },"7":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return " <ins>"
      + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"formRequiredLabel") || (depth0 != null ? lookupProperty(depth0,"formRequiredLabel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"formRequiredLabel","hash":{},"data":data,"loc":{"start":{"line":2,"column":173},"end":{"line":2,"column":194}}}) : helper)))
      + "</ins>";
  },"9":function(container,depth0,helpers,partials,data) {
      return "</br>";
  },"11":function(container,depth0,helpers,partials,data) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "					<option data-isother=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"isother") || (depth0 != null ? lookupProperty(depth0,"isother") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"isother","hash":{},"data":data,"loc":{"start":{"line":6,"column":27},"end":{"line":6,"column":38}}}) : helper)))
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":6,"column":50},"end":{"line":6,"column":56}}}) : helper)))
      + "\" value=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":6,"column":65},"end":{"line":6,"column":71}}}) : helper)))
      + "\" "
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isselected") : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":73},"end":{"line":6,"column":117}}})) != null ? stack1 : "")
      + ">"
      + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":6,"column":118},"end":{"line":6,"column":127}}}) : helper)))
      + "</option>\n";
  },"12":function(container,depth0,helpers,partials,data) {
      return "selected='selected'";
  },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "	<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"inputWrapperClass") || (depth0 != null ? lookupProperty(depth0,"inputWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputWrapperClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":36}}}) : helper))) != null ? stack1 : "")
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":48},"end":{"line":1,"column":56}}}) : helper)))
      + "-container\">\n		<label for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"labelForValue") || (depth0 != null ? lookupProperty(depth0,"labelForValue") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"labelForValue","hash":{},"data":data,"loc":{"start":{"line":2,"column":14},"end":{"line":2,"column":31}}}) : helper)))
      + "\" data-for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":43},"end":{"line":2,"column":51}}}) : helper)))
      + "\""
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":52},"end":{"line":2,"column":98}}})) != null ? stack1 : "")
      + ">"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data,"loc":{"start":{"line":2,"column":99},"end":{"line":2,"column":149}}})) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":149},"end":{"line":2,"column":207}}})) != null ? stack1 : "")
      + "</label>\n		"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":29}}})) != null ? stack1 : "")
      + "\n			<select "
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"commonInputAttributes") || (depth0 != null ? lookupProperty(depth0,"commonInputAttributes") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"commonInputAttributes","hash":{},"data":data,"loc":{"start":{"line":4,"column":11},"end":{"line":4,"column":38}}}) : helper))) != null ? stack1 : "")
      + ">\n"
      + ((stack1 = lookupProperty(helpers,"each").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"dataset") : depth0)) != null ? lookupProperty(stack1,"options") : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":4},"end":{"line":7,"column":13}}})) != null ? stack1 : "")
      + "			</select>\n	</div>\n";
  },"useData":true});
  
  Mura["templates"]["error"] = Mura.Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data,"loc":{"start":{"line":1,"column":102},"end":{"line":1,"column":111}}}) : helper)))
      + ": ";
  },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<div id=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":15}}}) : helper)))
      + "\" class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"formErrorWrapperClass") || (depth0 != null ? lookupProperty(depth0,"formErrorWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"formErrorWrapperClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":24},"end":{"line":1,"column":51}}}) : helper))) != null ? stack1 : "")
      + "\" data-field=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"field") || (depth0 != null ? lookupProperty(depth0,"field") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"field","hash":{},"data":data,"loc":{"start":{"line":1,"column":65},"end":{"line":1,"column":74}}}) : helper)))
      + "\" role=\"alert\">"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"label") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":89},"end":{"line":1,"column":120}}})) != null ? stack1 : "")
      + alias4(((helper = (helper = lookupProperty(helpers,"message") || (depth0 != null ? lookupProperty(depth0,"message") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"message","hash":{},"data":data,"loc":{"start":{"line":1,"column":120},"end":{"line":1,"column":131}}}) : helper)))
      + "</div>\r\n";
  },"useData":true});
  
  Mura["templates"]["file"] = Mura.Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return " <ins>"
      + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"formRequiredLabel") || (depth0 != null ? lookupProperty(depth0,"formRequiredLabel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"formRequiredLabel","hash":{},"data":data,"loc":{"start":{"line":2,"column":117},"end":{"line":2,"column":138}}}) : helper)))
      + "</ins>";
  },"3":function(container,depth0,helpers,partials,data) {
      return " aria-required=\"true\"";
  },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"inputWrapperClass") || (depth0 != null ? lookupProperty(depth0,"inputWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputWrapperClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":35}}}) : helper))) != null ? stack1 : "")
      + " mura-form-file-container\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":72},"end":{"line":1,"column":80}}}) : helper)))
      + "-container\">\r\n	<label for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"labelForValue") || (depth0 != null ? lookupProperty(depth0,"labelForValue") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"labelForValue","hash":{},"data":data,"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":30}}}) : helper)))
      + " mura-form-file-label\" data-for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":63},"end":{"line":2,"column":71}}}) : helper)))
      + "_attachment\">"
      + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":2,"column":84},"end":{"line":2,"column":93}}}) : helper)))
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":93},"end":{"line":2,"column":151}}})) != null ? stack1 : "")
      + "</label>\r\n	<input readonly type=\"text\" data-filename=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":3,"column":44},"end":{"line":3,"column":52}}}) : helper)))
      + "_attachment\""
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":64},"end":{"line":3,"column":110}}})) != null ? stack1 : "")
      + " placeholder=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"filePlaceholder") || (depth0 != null ? lookupProperty(depth0,"filePlaceholder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"filePlaceholder","hash":{},"data":data,"loc":{"start":{"line":3,"column":124},"end":{"line":3,"column":143}}}) : helper)))
      + "\" "
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"fileAttributes") || (depth0 != null ? lookupProperty(depth0,"fileAttributes") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fileAttributes","hash":{},"data":data,"loc":{"start":{"line":3,"column":145},"end":{"line":3,"column":165}}}) : helper))) != null ? stack1 : "")
      + ">\r\n	<input hidden data-filename=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":4,"column":30},"end":{"line":4,"column":38}}}) : helper)))
      + "_attachment\" type=\"file\" "
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"commonInputAttributes") || (depth0 != null ? lookupProperty(depth0,"commonInputAttributes") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"commonInputAttributes","hash":{},"data":data,"loc":{"start":{"line":4,"column":63},"end":{"line":4,"column":90}}}) : helper))) != null ? stack1 : "")
      + "/>\r\n	<div class=\"mura-form-preview\" style=\"display:none;\">\r\n		<img style=\"display:none;\" id=\"mura-form-preview-"
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":6,"column":51},"end":{"line":6,"column":59}}}) : helper)))
      + "_attachment\" src=\"\" onerror=\"this.onerror=null;this.src='';this.style.display='none';\">\r\n	</div>\r\n</div>\r\n";
  },"useData":true});
  
  Mura["templates"]["form"] = Mura.Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<form id=\"frm"
      + alias4(((helper = (helper = lookupProperty(helpers,"objectid") || (depth0 != null ? lookupProperty(depth0,"objectid") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"objectid","hash":{},"data":data,"loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":25}}}) : helper)))
      + "\" class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"formClass") || (depth0 != null ? lookupProperty(depth0,"formClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"formClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":34},"end":{"line":1,"column":49}}}) : helper))) != null ? stack1 : "")
      + "\" novalidate=\"novalidate\" enctype=\"multipart/form-data\">\n<div class=\"error-container-"
      + alias4(((helper = (helper = lookupProperty(helpers,"objectid") || (depth0 != null ? lookupProperty(depth0,"objectid") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"objectid","hash":{},"data":data,"loc":{"start":{"line":2,"column":28},"end":{"line":2,"column":40}}}) : helper)))
      + "\">\n</div>\n<div class=\"field-container-"
      + alias4(((helper = (helper = lookupProperty(helpers,"objectid") || (depth0 != null ? lookupProperty(depth0,"objectid") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"objectid","hash":{},"data":data,"loc":{"start":{"line":4,"column":28},"end":{"line":4,"column":40}}}) : helper)))
      + "\">\n</div>\n<div class=\"paging-container-"
      + alias4(((helper = (helper = lookupProperty(helpers,"objectid") || (depth0 != null ? lookupProperty(depth0,"objectid") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"objectid","hash":{},"data":data,"loc":{"start":{"line":6,"column":29},"end":{"line":6,"column":41}}}) : helper)))
      + "\">\n</div>\n	<input type=\"hidden\" name=\"formid\" value=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"objectid") || (depth0 != null ? lookupProperty(depth0,"objectid") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"objectid","hash":{},"data":data,"loc":{"start":{"line":8,"column":43},"end":{"line":8,"column":55}}}) : helper)))
      + "\">\n</form>\n";
  },"useData":true});
  
  Mura["templates"]["hidden"] = Mura.Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<input type=\"hidden\" name=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":27},"end":{"line":1,"column":35}}}) : helper)))
      + "\" "
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"commonInputAttributes") || (depth0 != null ? lookupProperty(depth0,"commonInputAttributes") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"commonInputAttributes","hash":{},"data":data,"loc":{"start":{"line":1,"column":37},"end":{"line":1,"column":64}}}) : helper))) != null ? stack1 : "")
      + " value=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":1,"column":72},"end":{"line":1,"column":81}}}) : helper)))
      + "\" />			\n";
  },"useData":true});
  
  Mura["templates"]["list"] = Mura.Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "					<option value=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":7,"column":20},"end":{"line":7,"column":28}}}) : helper)))
      + "\">"
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":7,"column":30},"end":{"line":7,"column":38}}}) : helper)))
      + "</option>\n";
  },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<form>\n	<div class=\"mura-control-group\">\n		<label for=\"beanList\">Choose Entity:</label>	\n		<div class=\"form-group-select\">\n			<select type=\"text\" name=\"bean\" id=\"select-bean-value\">\n"
      + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":4},"end":{"line":8,"column":13}}})) != null ? stack1 : "")
      + "			</select>\n		</div>\n	</div>\n	<div class=\"mura-control-group\">\n		<button type=\"button\" id=\"select-bean\">Go</button>\n	</div>\n</form>";
  },"useData":true});
  
  Mura["templates"]["nested"] = Mura.Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<div class=\"field-container-"
      + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"objectid") || (depth0 != null ? lookupProperty(depth0,"objectid") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"objectid","hash":{},"data":data,"loc":{"start":{"line":1,"column":28},"end":{"line":1,"column":40}}}) : helper)))
      + "\">\r\n\r\n</div>\r\n";
  },"useData":true});
  
  Mura["templates"]["paging"] = Mura.Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<button class=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"class") || (depth0 != null ? lookupProperty(depth0,"class") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"class","hash":{},"data":data,"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":24}}}) : helper)))
      + "\" type=\"button\" data-page=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"page") || (depth0 != null ? lookupProperty(depth0,"page") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"page","hash":{},"data":data,"loc":{"start":{"line":1,"column":51},"end":{"line":1,"column":59}}}) : helper)))
      + "\">"
      + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":1,"column":61},"end":{"line":1,"column":70}}}) : helper)))
      + "</button> ";
  },"useData":true});
  
  Mura["templates"]["radio_static"] = Mura.Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"summary") || (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"summary","hash":{},"data":data,"loc":{"start":{"line":4,"column":19},"end":{"line":4,"column":30}}}) : helper)));
  },"3":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data,"loc":{"start":{"line":4,"column":38},"end":{"line":4,"column":47}}}) : helper)));
  },"5":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return " <ins>"
      + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"formRequiredLabel") || (depth0 != null ? lookupProperty(depth0,"formRequiredLabel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"formRequiredLabel","hash":{},"data":data,"loc":{"start":{"line":4,"column":78},"end":{"line":4,"column":99}}}) : helper)))
      + "</ins>";
  },"7":function(container,depth0,helpers,partials,data) {
      return "</br>";
  },"9":function(container,depth0,helpers,partials,data,blockParams,depths) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "				<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"radioWrapperClass") || (depth0 != null ? lookupProperty(depth0,"radioWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"radioWrapperClass","hash":{},"data":data,"loc":{"start":{"line":8,"column":16},"end":{"line":8,"column":39}}}) : helper))) != null ? stack1 : "")
      + "\">\n					<input type=\"radio\" name=\""
      + alias4(container.lambda((depths[1] != null ? lookupProperty(depths[1],"name") : depths[1]), depth0))
      + "\" class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"radioClass") || (depth0 != null ? lookupProperty(depth0,"radioClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"radioClass","hash":{},"data":data,"loc":{"start":{"line":9,"column":51},"end":{"line":9,"column":67}}}) : helper))) != null ? stack1 : "")
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"datarecordid") || (depth0 != null ? lookupProperty(depth0,"datarecordid") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"datarecordid","hash":{},"data":data,"loc":{"start":{"line":9,"column":79},"end":{"line":9,"column":95}}}) : helper)))
      + "\" value=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":9,"column":104},"end":{"line":9,"column":113}}}) : helper)))
      + "\"  "
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isselected") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":116},"end":{"line":9,"column":158}}})) != null ? stack1 : "")
      + "/>\n					<label for=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"datarecordid") || (depth0 != null ? lookupProperty(depth0,"datarecordid") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"datarecordid","hash":{},"data":data,"loc":{"start":{"line":10,"column":23},"end":{"line":10,"column":39}}}) : helper)))
      + "\" class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"radioLabelClass") || (depth0 != null ? lookupProperty(depth0,"radioLabelClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"radioLabelClass","hash":{},"data":data,"loc":{"start":{"line":10,"column":48},"end":{"line":10,"column":69}}}) : helper))) != null ? stack1 : "")
      + "\">"
      + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":10,"column":71},"end":{"line":10,"column":80}}}) : helper)))
      + "</label>\n				</div>\n";
  },"10":function(container,depth0,helpers,partials,data) {
      return "checked='checked'";
  },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "	<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"inputWrapperClass") || (depth0 != null ? lookupProperty(depth0,"inputWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputWrapperClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":36}}}) : helper))) != null ? stack1 : "")
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":48},"end":{"line":1,"column":56}}}) : helper)))
      + "-container\">\n		<div class=\"mura-radio-group\">\n			<label class=\"mura-group-label\" for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":3,"column":40},"end":{"line":3,"column":48}}}) : helper)))
      + "\">\n				"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(3, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":54}}})) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":54},"end":{"line":4,"column":112}}})) != null ? stack1 : "")
      + "\n			</label>\n			"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":3},"end":{"line":6,"column":30}}})) != null ? stack1 : "")
      + "\n"
      + ((stack1 = (lookupProperty(helpers,"eachStatic")||(depth0 && lookupProperty(depth0,"eachStatic"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"dataset") : depth0),{"name":"eachStatic","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":3},"end":{"line":12,"column":18}}})) != null ? stack1 : "")
      + "		</div>\n	</div>\n";
  },"useData":true,"useDepths":true});
  
  Mura["templates"]["radio"] = Mura.Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"summary") || (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"summary","hash":{},"data":data,"loc":{"start":{"line":4,"column":19},"end":{"line":4,"column":30}}}) : helper)));
  },"3":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data,"loc":{"start":{"line":4,"column":38},"end":{"line":4,"column":47}}}) : helper)));
  },"5":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return " <ins>"
      + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"formRequiredLabel") || (depth0 != null ? lookupProperty(depth0,"formRequiredLabel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"formRequiredLabel","hash":{},"data":data,"loc":{"start":{"line":4,"column":78},"end":{"line":4,"column":99}}}) : helper)))
      + "</ins>";
  },"7":function(container,depth0,helpers,partials,data) {
      return "</br>";
  },"9":function(container,depth0,helpers,partials,data,blockParams,depths) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "				<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"radioWrapperClass") || (depth0 != null ? lookupProperty(depth0,"radioWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"radioWrapperClass","hash":{},"data":data,"loc":{"start":{"line":8,"column":16},"end":{"line":8,"column":39}}}) : helper))) != null ? stack1 : "")
      + "\">\n					<input type=\"radio\" name=\""
      + alias4(container.lambda((depths[1] != null ? lookupProperty(depths[1],"name") : depths[1]), depth0))
      + "id\" class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"radioClass") || (depth0 != null ? lookupProperty(depth0,"radioClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"radioClass","hash":{},"data":data,"loc":{"start":{"line":9,"column":53},"end":{"line":9,"column":69}}}) : helper))) != null ? stack1 : "")
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":9,"column":81},"end":{"line":9,"column":87}}}) : helper)))
      + "\" value=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":9,"column":96},"end":{"line":9,"column":102}}}) : helper)))
      + "\" "
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isselected") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":104},"end":{"line":9,"column":146}}})) != null ? stack1 : "")
      + "/>\n					<label for=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":10,"column":23},"end":{"line":10,"column":29}}}) : helper)))
      + "\" test1=1 class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"radioLabelClass") || (depth0 != null ? lookupProperty(depth0,"radioLabelClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"radioLabelClass","hash":{},"data":data,"loc":{"start":{"line":10,"column":46},"end":{"line":10,"column":67}}}) : helper))) != null ? stack1 : "")
      + "\">"
      + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":10,"column":69},"end":{"line":10,"column":78}}}) : helper)))
      + "</label>\n				</div>\n";
  },"10":function(container,depth0,helpers,partials,data) {
      return "checked='checked'";
  },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "	<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"inputWrapperClass") || (depth0 != null ? lookupProperty(depth0,"inputWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputWrapperClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":36}}}) : helper))) != null ? stack1 : "")
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":48},"end":{"line":1,"column":56}}}) : helper)))
      + "-container\">\n		<div class=\"mura-radio-group\">\n			<label class=\"mura-group-label\" for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":3,"column":40},"end":{"line":3,"column":48}}}) : helper)))
      + "\">\n				"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(3, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":54}}})) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":54},"end":{"line":4,"column":112}}})) != null ? stack1 : "")
      + "\n			</label>\n			"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":3},"end":{"line":6,"column":30}}})) != null ? stack1 : "")
      + "\n"
      + ((stack1 = lookupProperty(helpers,"each").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"dataset") : depth0)) != null ? lookupProperty(stack1,"options") : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":3},"end":{"line":12,"column":12}}})) != null ? stack1 : "")
      + "		</div>\n	</div>\n";
  },"useData":true,"useDepths":true});
  
  Mura["templates"]["section"] = Mura.Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"inputWrapperClass") || (depth0 != null ? lookupProperty(depth0,"inputWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputWrapperClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":35}}}) : helper))) != null ? stack1 : "")
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":47},"end":{"line":1,"column":55}}}) : helper)))
      + "-container\">\r\n<div class=\"mura-section\">"
      + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":2,"column":26},"end":{"line":2,"column":35}}}) : helper)))
      + "</div>\r\n<div class=\"mura-divide\"></div>\r\n</div>";
  },"useData":true});
  
  Mura["templates"]["success"] = Mura.Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"formResponseWrapperClass") || (depth0 != null ? lookupProperty(depth0,"formResponseWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"formResponseWrapperClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":42}}}) : helper))) != null ? stack1 : "")
      + "\">"
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"responsemessage") || (depth0 != null ? lookupProperty(depth0,"responsemessage") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"responsemessage","hash":{},"data":data,"loc":{"start":{"line":1,"column":44},"end":{"line":1,"column":65}}}) : helper))) != null ? stack1 : "")
      + "</div>\n";
  },"useData":true});
  
  Mura["templates"]["table"] = Mura.Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<option value=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"num") || (depth0 != null ? lookupProperty(depth0,"num") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"num","hash":{},"data":data,"loc":{"start":{"line":8,"column":102},"end":{"line":8,"column":109}}}) : helper)))
      + "\" "
      + alias4(((helper = (helper = lookupProperty(helpers,"selected") || (depth0 != null ? lookupProperty(depth0,"selected") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"selected","hash":{},"data":data,"loc":{"start":{"line":8,"column":111},"end":{"line":8,"column":123}}}) : helper)))
      + ">"
      + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":8,"column":124},"end":{"line":8,"column":133}}}) : helper)))
      + "</option>";
  },"3":function(container,depth0,helpers,partials,data) {
      var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "					<option value=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":27,"column":20},"end":{"line":27,"column":28}}}) : helper)))
      + "\" "
      + alias4(((helper = (helper = lookupProperty(helpers,"selected") || (depth0 != null ? lookupProperty(depth0,"selected") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"selected","hash":{},"data":data,"loc":{"start":{"line":27,"column":30},"end":{"line":27,"column":42}}}) : helper)))
      + ">"
      + alias4(((helper = (helper = lookupProperty(helpers,"displayName") || (depth0 != null ? lookupProperty(depth0,"displayName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displayName","hash":{},"data":data,"loc":{"start":{"line":27,"column":43},"end":{"line":27,"column":58}}}) : helper)))
      + "</option>\n";
  },"5":function(container,depth0,helpers,partials,data) {
      var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "			<th class='data-sort' data-value='"
      + alias4(((helper = (helper = lookupProperty(helpers,"column") || (depth0 != null ? lookupProperty(depth0,"column") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"column","hash":{},"data":data,"loc":{"start":{"line":53,"column":37},"end":{"line":53,"column":47}}}) : helper)))
      + "'>"
      + alias4(((helper = (helper = lookupProperty(helpers,"displayName") || (depth0 != null ? lookupProperty(depth0,"displayName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displayName","hash":{},"data":data,"loc":{"start":{"line":53,"column":49},"end":{"line":53,"column":64}}}) : helper)))
      + "</th>\n";
  },"7":function(container,depth0,helpers,partials,data,blockParams,depths) {
      var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "			<tr class=\"even\">\n"
      + ((stack1 = (lookupProperty(helpers,"eachColRow")||(depth0 && lookupProperty(depth0,"eachColRow"))||alias2).call(alias1,depth0,(depths[1] != null ? lookupProperty(depths[1],"columns") : depths[1]),{"name":"eachColRow","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":61,"column":4},"end":{"line":63,"column":19}}})) != null ? stack1 : "")
      + "				<td>\n"
      + ((stack1 = (lookupProperty(helpers,"eachColButton")||(depth0 && lookupProperty(depth0,"eachColButton"))||alias2).call(alias1,depth0,{"name":"eachColButton","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":65,"column":4},"end":{"line":67,"column":22}}})) != null ? stack1 : "")
      + "				</td>\n			</tr>\n";
  },"8":function(container,depth0,helpers,partials,data) {
      return "					<td>"
      + container.escapeExpression(container.lambda(depth0, depth0))
      + "</td>\n";
  },"10":function(container,depth0,helpers,partials,data) {
      var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "				<button type=\"button\" class=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"type") || (depth0 != null ? lookupProperty(depth0,"type") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data,"loc":{"start":{"line":66,"column":33},"end":{"line":66,"column":41}}}) : helper)))
      + "\" data-value=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":66,"column":55},"end":{"line":66,"column":61}}}) : helper)))
      + "\" data-pos=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":66,"column":73},"end":{"line":66,"column":83}}}) : helper)))
      + "\">"
      + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":66,"column":85},"end":{"line":66,"column":94}}}) : helper)))
      + "</button>\n";
  },"12":function(container,depth0,helpers,partials,data) {
      var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "				<button class='data-nav' data-value=\""
      + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"rows") : depth0)) != null ? lookupProperty(stack1,"links") : stack1)) != null ? lookupProperty(stack1,"first") : stack1), depth0))
      + "\">First</button>\n";
  },"14":function(container,depth0,helpers,partials,data) {
      var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "				<button class='data-nav' data-value=\""
      + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"rows") : depth0)) != null ? lookupProperty(stack1,"links") : stack1)) != null ? lookupProperty(stack1,"previous") : stack1), depth0))
      + "\">Prev</button>\n";
  },"16":function(container,depth0,helpers,partials,data) {
      var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "				<button class='data-nav' data-value=\""
      + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"rows") : depth0)) != null ? lookupProperty(stack1,"links") : stack1)) != null ? lookupProperty(stack1,"next") : stack1), depth0))
      + "\">Next</button>\n";
  },"18":function(container,depth0,helpers,partials,data) {
      var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "				<button class='data-nav' data-value=\""
      + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"rows") : depth0)) != null ? lookupProperty(stack1,"links") : stack1)) != null ? lookupProperty(stack1,"last") : stack1), depth0))
      + "\">Last</button>\n";
  },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
      var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "	<div class=\"mura-control-group\">\n		<div id=\"filter-results-container\">\n			<div id=\"date-filters\">\n				<div class=\"control-group\">\n				  <label>From</label>\n				  <div class=\"controls\">\n				  	<input type=\"text\" class=\"datepicker mura-date\" id=\"date1\" name=\"date1\" validate=\"date\" value=\""
      + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"filters") : depth0)) != null ? lookupProperty(stack1,"fromdate") : stack1), depth0))
      + "\">\n				  	<select id=\"hour1\" name=\"hour1\" class=\"mura-date\">"
      + ((stack1 = (lookupProperty(helpers,"eachHour")||(depth0 && lookupProperty(depth0,"eachHour"))||alias4).call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"filters") : depth0)) != null ? lookupProperty(stack1,"fromhour") : stack1),{"name":"eachHour","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":57},"end":{"line":8,"column":155}}})) != null ? stack1 : "")
      + "</select></select>\n					</div>\n				</div>\n			\n				<div class=\"control-group\">\n				  <label>To</label>\n				  <div class=\"controls\">\n				  	<input type=\"text\" class=\"datepicker mura-date\" id=\"date2\" name=\"date2\" validate=\"date\" value=\""
      + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"filters") : depth0)) != null ? lookupProperty(stack1,"todate") : stack1), depth0))
      + "\">\n				  	<select id=\"hour2\" name=\"hour2\"  class=\"mura-date\">"
      + ((stack1 = (lookupProperty(helpers,"eachHour")||(depth0 && lookupProperty(depth0,"eachHour"))||alias4).call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"filters") : depth0)) != null ? lookupProperty(stack1,"tohour") : stack1),{"name":"eachHour","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":58},"end":{"line":16,"column":154}}})) != null ? stack1 : "")
      + "</select></select>\n				   </select>\n					</div>\n				</div>\n			</div>\n					\n			<div class=\"control-group\">\n				<label>Keywords</label>\n				<div class=\"controls\">\n					<select name=\"filterBy\" class=\"mura-date\" id=\"results-filterby\">\n"
      + ((stack1 = (lookupProperty(helpers,"eachKey")||(depth0 && lookupProperty(depth0,"eachKey"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"properties") : depth0),((stack1 = (depth0 != null ? lookupProperty(depth0,"filters") : depth0)) != null ? lookupProperty(stack1,"filterby") : stack1),{"name":"eachKey","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":5},"end":{"line":28,"column":17}}})) != null ? stack1 : "")
      + "					</select>\n					<input type=\"text\" class=\"mura-half\" name=\"keywords\" id=\"results-keywords\" value=\""
      + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"filters") : depth0)) != null ? lookupProperty(stack1,"filterkey") : stack1), depth0))
      + "\">\n				</div>\n			</div>\n			<div class=\"form-actions\">\n				<button type=\"button\" class=\"btn\" id=\"btn-results-search\" ><i class=\"mi-bar-chart\"></i> View Data</button>\n				<button type=\"button\" class=\"btn\"  id=\"btn-results-download\" ><i class=\"mi-download\"></i> Download</button>\n			</div>\n		</div>\n	<div>\n\n	<ul class=\"metadata\">\n		<li>Page:\n			<strong>"
      + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"rows") : depth0)) != null ? lookupProperty(stack1,"pageindex") : stack1), depth0))
      + " of "
      + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"rows") : depth0)) != null ? lookupProperty(stack1,"totalpages") : stack1), depth0))
      + "</strong>\n		</li>\n		<li>Total Records:\n			<strong>"
      + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"rows") : depth0)) != null ? lookupProperty(stack1,"totalitems") : stack1), depth0))
      + "</strong>\n		</li>\n	</ul>\n\n	<table style=\"width: 100%\" class=\"table\">\n		<thead>\n		<tr>\n"
      + ((stack1 = lookupProperty(helpers,"each").call(alias3,(depth0 != null ? lookupProperty(depth0,"columns") : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":52,"column":2},"end":{"line":54,"column":11}}})) != null ? stack1 : "")
      + "			<th></th>\n		</tr>\n		</thead>\n		<tbody>\n"
      + ((stack1 = lookupProperty(helpers,"each").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"rows") : depth0)) != null ? lookupProperty(stack1,"items") : stack1),{"name":"each","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":59,"column":2},"end":{"line":70,"column":11}}})) != null ? stack1 : "")
      + "		</tbody>\n		<tfoot>\n		<tr>\n			<td>\n"
      + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"rows") : depth0)) != null ? lookupProperty(stack1,"links") : stack1)) != null ? lookupProperty(stack1,"first") : stack1),{"name":"if","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":75,"column":4},"end":{"line":77,"column":11}}})) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"rows") : depth0)) != null ? lookupProperty(stack1,"links") : stack1)) != null ? lookupProperty(stack1,"previous") : stack1),{"name":"if","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":78,"column":4},"end":{"line":80,"column":11}}})) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"rows") : depth0)) != null ? lookupProperty(stack1,"links") : stack1)) != null ? lookupProperty(stack1,"next") : stack1),{"name":"if","hash":{},"fn":container.program(16, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":81,"column":4},"end":{"line":83,"column":11}}})) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"rows") : depth0)) != null ? lookupProperty(stack1,"links") : stack1)) != null ? lookupProperty(stack1,"last") : stack1),{"name":"if","hash":{},"fn":container.program(18, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":84,"column":4},"end":{"line":86,"column":11}}})) != null ? stack1 : "")
      + "			</td>\n		</tfoot>\n	</table>\n</div>";
  },"useData":true,"useDepths":true});
  
  Mura["templates"]["textarea"] = Mura.Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"summary") || (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"summary","hash":{},"data":data,"loc":{"start":{"line":2,"column":67},"end":{"line":2,"column":78}}}) : helper)));
  },"3":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data,"loc":{"start":{"line":2,"column":86},"end":{"line":2,"column":95}}}) : helper)));
  },"5":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return " <ins>"
      + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"formRequiredLabel") || (depth0 != null ? lookupProperty(depth0,"formRequiredLabel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"formRequiredLabel","hash":{},"data":data,"loc":{"start":{"line":2,"column":126},"end":{"line":2,"column":147}}}) : helper)))
      + "</ins>";
  },"7":function(container,depth0,helpers,partials,data) {
      return "</br>";
  },"9":function(container,depth0,helpers,partials,data) {
      return " aria-required=\"true\"";
  },"11":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return " placeholder=\""
      + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"placeholder") || (depth0 != null ? lookupProperty(depth0,"placeholder") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"placeholder","hash":{},"data":data,"loc":{"start":{"line":4,"column":117},"end":{"line":4,"column":132}}}) : helper)))
      + "\"";
  },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"inputWrapperClass") || (depth0 != null ? lookupProperty(depth0,"inputWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputWrapperClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":35}}}) : helper))) != null ? stack1 : "")
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":47},"end":{"line":1,"column":55}}}) : helper)))
      + "-container\">\r\n	<label for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"labelForValue") || (depth0 != null ? lookupProperty(depth0,"labelForValue") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"labelForValue","hash":{},"data":data,"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":30}}}) : helper)))
      + "\" data-for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":42},"end":{"line":2,"column":50}}}) : helper)))
      + "\">"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":2,"column":52},"end":{"line":2,"column":102}}})) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":102},"end":{"line":2,"column":160}}})) != null ? stack1 : "")
      + "</label>\r\n	"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":28}}})) != null ? stack1 : "")
      + "\r\n	<textarea "
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"commonInputAttributes") || (depth0 != null ? lookupProperty(depth0,"commonInputAttributes") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"commonInputAttributes","hash":{},"data":data,"loc":{"start":{"line":4,"column":11},"end":{"line":4,"column":38}}}) : helper))) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":38},"end":{"line":4,"column":84}}})) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"placeholder") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":84},"end":{"line":4,"column":140}}})) != null ? stack1 : "")
      + ">"
      + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":4,"column":141},"end":{"line":4,"column":150}}}) : helper)))
      + "</textarea>\r\n</div>\r\n";
  },"useData":true});
  
  Mura["templates"]["textblock"] = Mura.Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"inputWrapperClass") || (depth0 != null ? lookupProperty(depth0,"inputWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputWrapperClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":35}}}) : helper))) != null ? stack1 : "")
      + "\" id=\"field-"
      + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":47},"end":{"line":1,"column":55}}}) : helper)))
      + "-container\">\r\n<div class=\"mura-form-text\">"
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":2,"column":28},"end":{"line":2,"column":39}}}) : helper))) != null ? stack1 : "")
      + "</div>\r\n</div>\r\n";
  },"useData":true});
  
  Mura["templates"]["textfield"] = Mura.Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"summary") || (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"summary","hash":{},"data":data,"loc":{"start":{"line":2,"column":67},"end":{"line":2,"column":78}}}) : helper)));
  },"3":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data,"loc":{"start":{"line":2,"column":86},"end":{"line":2,"column":95}}}) : helper)));
  },"5":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return " <ins>"
      + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"formRequiredLabel") || (depth0 != null ? lookupProperty(depth0,"formRequiredLabel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"formRequiredLabel","hash":{},"data":data,"loc":{"start":{"line":2,"column":126},"end":{"line":2,"column":147}}}) : helper)))
      + "</ins>";
  },"7":function(container,depth0,helpers,partials,data) {
      return "</br>";
  },"9":function(container,depth0,helpers,partials,data) {
      return " aria-required=\"true\"";
  },"11":function(container,depth0,helpers,partials,data) {
      var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return " placeholder=\""
      + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"placeholder") || (depth0 != null ? lookupProperty(depth0,"placeholder") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"placeholder","hash":{},"data":data,"loc":{"start":{"line":4,"column":164},"end":{"line":4,"column":179}}}) : helper)))
      + "\"";
  },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<div class=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"inputWrapperClass") || (depth0 != null ? lookupProperty(depth0,"inputWrapperClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputWrapperClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":35}}}) : helper))) != null ? stack1 : "")
      + "\" id=\"field-"
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":47},"end":{"line":1,"column":55}}}) : helper)))
      + "-container\">\r\n	<label for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"labelForValue") || (depth0 != null ? lookupProperty(depth0,"labelForValue") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"labelForValue","hash":{},"data":data,"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":30}}}) : helper)))
      + "\" data-for=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":42},"end":{"line":2,"column":50}}}) : helper)))
      + "\">"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":2,"column":52},"end":{"line":2,"column":102}}})) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":102},"end":{"line":2,"column":160}}})) != null ? stack1 : "")
      + "</label>\r\n	"
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"summary") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":28}}})) != null ? stack1 : "")
      + "\r\n	<input type=\""
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"textInputTypeValue") || (depth0 != null ? lookupProperty(depth0,"textInputTypeValue") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"textInputTypeValue","hash":{},"data":data,"loc":{"start":{"line":4,"column":14},"end":{"line":4,"column":38}}}) : helper))) != null ? stack1 : "")
      + "\" "
      + ((stack1 = ((helper = (helper = lookupProperty(helpers,"commonInputAttributes") || (depth0 != null ? lookupProperty(depth0,"commonInputAttributes") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"commonInputAttributes","hash":{},"data":data,"loc":{"start":{"line":4,"column":40},"end":{"line":4,"column":67}}}) : helper))) != null ? stack1 : "")
      + " value=\""
      + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":4,"column":75},"end":{"line":4,"column":84}}}) : helper)))
      + "\""
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isrequired") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":85},"end":{"line":4,"column":131}}})) != null ? stack1 : "")
      + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"placeholder") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":131},"end":{"line":4,"column":187}}})) != null ? stack1 : "")
      + "/>\r\n</div>\r\n";
  },"useData":true});
  
  Mura["templates"]["view"] = Mura.Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "	<li>\n		<strong>"
      + alias4(((helper = (helper = lookupProperty(helpers,"displayName") || (depth0 != null ? lookupProperty(depth0,"displayName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displayName","hash":{},"data":data,"loc":{"start":{"line":5,"column":10},"end":{"line":5,"column":25}}}) : helper)))
      + ": </strong> "
      + alias4(((helper = (helper = lookupProperty(helpers,"displayValue") || (depth0 != null ? lookupProperty(depth0,"displayValue") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displayValue","hash":{},"data":data,"loc":{"start":{"line":5,"column":37},"end":{"line":5,"column":53}}}) : helper)))
      + " \n	</li>\n";
  },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined
      };
  
    return "<div class=\"mura-control-group\">\n<ul>\n"
      + ((stack1 = (lookupProperty(helpers,"eachProp")||(depth0 && lookupProperty(depth0,"eachProp"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"eachProp","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":7,"column":13}}})) != null ? stack1 : "")
      + "</ul>\n<button type=\"button\" class=\"nav-back\">Back</button>\n</div>";
  },"useData":true});
  }
  
  module.exports=attach;