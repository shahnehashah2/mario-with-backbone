var DrawPyramidText = Backbone.View.extend({
    el: '#draw-pyramid-text',
    initialize: function(){
        this.listenTo(this.model, 'change', this.render);
    },
    render(){
        this.$el.html(
            `<strong>
            Draw a pyramid of height
            ${this.model.get('pyramid_height')}
            </strong>`
        );
    }
});


var DrawForm = Backbone.View.extend({
    el: '#draw-form',
    initialize: function(){
        this.listenTo(this.model, 'change', this.render);
    },
    formTemplate: _.template(`
        <label>
            How high?
            <input type="text" id="height"
                value="<%= height %>"
                <% if (error) { %>
                    class="invalid-field"
                <% } %>
            />
            <label class="error-message"><%= error %></label>
        </label>
        <br><br>
        <input type="submit" value="Draw a pyramid"/>
    `),
    render: function(){
        var height = this.model.get('pyramid_height'),
            heightStr = this.model.get('pyramid_height_str'),
            error;

        var tooTall = 100;
        // if the height is not-a-number or not positive, yell at them and exit early
        if (heightStr === ''){
            error = 'Please enter a height';
        } else if (isNaN(height) || height < 1) {
            error = heightStr + ": That's not a valid height.";
        } else if (height > tooTall) {
            error = "Are you cray? I can't build a pyramid that tall.";
        }
        htmlStr = this.formTemplate({
            height: height,
            error: error
        });
        this.$el.empty().append(htmlStr);
        return this;
    },
    events: {
        'click input[type="submit"]': 'submitForm',
    },
    submitForm: function(event){
        event.preventDefault();
        var heightStr = this.$('#height').val();
        this.model.set('pyramid_height_str', heightStr);
        this.model.set('pyramid_height', parseInt(heightStr));
    }
});


function drawPyramid(height) {
    // for each row....
    var rowStrs = [];
    for (var row = 0; row < height; row++) {
        // figure out number of bricks and spaces
        var numBricks = row + 2;
        var numSpaces = height - row - 1;

        // build up a string for this row
        var rowStr = "";
        for (var i = 0; i < numSpaces; i++) {
            var spaceChar = "&nbsp";
            rowStr += spaceChar;
        }
        for (var i = 0; i < numBricks; i++)
            rowStr += "#";

        // make a <p> element for this row, and insert it into the #pyramid container
        rowStrs.push('<p>' + rowStr + '</p>');
    }
    return rowStrs.join('\n');
}


var Pyramid = Backbone.View.extend({
    el: '#pyramid',
    initialize: function(){
        this.listenTo(this.model, 'change', this.render);
    },
    render: function(){
        var htmlStr = drawPyramid(this.model.get('pyramid_height'));
        this.$el.empty().append(htmlStr);
        return this;
    }
});

var marioModel = new Backbone.Model({pyramid_height: 5}),
    drawForm = new DrawForm({model: marioModel}).render(),
    drawText = new DrawPyramidText({model: marioModel}).render(),
    pyramid = new Pyramid({model: marioModel}).render();
