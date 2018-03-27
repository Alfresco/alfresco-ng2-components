## Properties

{% for prop in properties %}{% if prop.isInput %}| {{prop.name}} | {{prop.type}} | {{prop.defaultValue}} | {{prop.docText}} |{% endif %}
{% endfor %}

## Events

{% for prop in properties %}{% if prop.isOutput %}| {{prop.name}} | {{prop.type}} | {{prop.docText}} |{% endif %}
{% endfor %}

## Methods

{% for meth in methods %}{% for sig in meth.signatures %}- {{meth.name}}{{sig}}: {{meth.returnType}}{% endfor %}
{{meth.docText}}
{% endfor %}
