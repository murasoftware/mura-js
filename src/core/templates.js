
var Mura=require('./core');
var Handlebars=require('handlebars/runtime');
Mura.Handlebars=Handlebars.create();
Mura.templatesLoaded=false;
Handlebars.noConflict();

Mura.templates=Mura.templates || {};
Mura.templates['meta']=function(context){
	if(typeof context.labeltag == 'undefined' || !context.labeltag){
		context.labeltag='h2';
	}
	if(context.label){
		return '<div class="mura-object-meta-wrapper"><div class="mura-object-meta"><' + Mura.escapeHTML(context.labeltag) + '>' + Mura.escapeHTML(context.label) + '</' + Mura.escapeHTML(context.labeltag) + '></div></div><div class="mura-flex-break"></div>';
	} else {
		return '';
	}
}
Mura.templates['content']=function(context){
	var html=context.html || context.content || context.source || '';
	if(Array.isArray(html)){
		html='';
	}
	return '<div class="mura-object-content">' + html + '</div>';
}
Mura.templates['text']=function(context){
	context=context || {};
	if(context.label){
		context.source=context.source || '';
	} else {
		context.source=context.source || '<p></p>';
	}
	return context.source;
}
Mura.templates['embed']=function(context){
	context=context || {};
	if(context.source){
		context.source=context.source || '';
	} else {
		context.source=context.source || '<p></p>';
	}
	return context.source;
}

Mura.templates['image']=function(context){
	context=context || {};
	context.src=context.src||'';
	context.alt=context.alt||'';
	context.caption=context.caption||'';
	context.imagelink=context.imagelink||'';
	context.fit=context.fit||'';

	var source='';
	var style='';

	if(!context.src){
		return '';
	}

	if(context.fit){
		style=' style="height:100%;width:100%;object-fit:' + Mura.escapeHTML(context.fit) +';" data-object-fit="' + Mura.escapeHTML(context.fit) + '" ';
	}

	source='<img src="' + Mura.escapeHTML(context.src) + '" alt="' + Mura.escapeHTML(context.alt) + '"' +  style + ' loading="lazy"/>';
	if(context.imagelink){
		context.imagelinktarget=context.imagelinktarget || "";
		var targetString="";
		if(context.imagelinktarget){
			targetString=' target="' + Mura.escapeHTML(context.imagelinktarget) + '"';
		}
		source='<a href="' +  Mura.escapeHTML(context.imagelink) + '"' + targetString + '/>' + source + '</a>';
	}
	if(context.caption && context.caption != '<p></p>'){
		source+='<figcaption>' + context.caption + '</figcaption>';
	}
	source='<figure style="margin:0px,height:100%">' + source + '</figure>';

	return source;
}

require('./templates-handlebars');
