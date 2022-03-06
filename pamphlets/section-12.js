/* 177-1. Section Intro:
178-2. Recap Server-Side vs Client-Side Rendering:

170-3. Setting up Pug in Express:
Our pug templates are actually called views in express and that's because these templates are in fact the views in the model view controller architecture.
We already have the controllers and the model folders and so it's time to create the views folder.

The path we set in second arg of app.set('views' , <path>), is always relative to the directory from where we launchthe node application and that usually
is the root project folder, but it might not be, so we shouldn't use './...' there, but we should instead use the directory name variable.

171-4. First Steps with Pug:
Comments in pug:
// will still show the comment in html output
//- won't show the comment in html

unbuffered code is the code that is not going to add anything to the html output of pug adn we write that by placing dash and then the things that
we want to write! Like:
- const x = 0;
h2= 2* x

The third way is interpolation

172-5. Creating Our Base Template:

172-6. Including Files into Pug Templates:
I like to prefix the files that only serve for being included into other templates, with an underscore. Like a sass file that is being included into
another sass file.
You can use pug beautify to automatically beautify a pug file. For using it, you need to create a vscode command by hitting: cmd+shift+p and then
write pug and it will beautify the selected content.

173-7. Extending Our Base Template with Blocks:
With `extend`s we will be able to use the same base layout for every single page that we want to render.

Implement the routes for other pages. Do this like:
app.get('/overview', () => {...});

Now for each of the templates like overview and tour, we ONLY want to put the content for that SPECIFIC page. So we want no footer and no header and none of
the stuff that we have in base.pug , in overview page. So again, really the content for overview page.
The base.pug template is parent template of overview.pug . This process is called extending.
Whenever the overview template(child template) is rendered, we then take the base template(parent) and fill it up with the content of child template and
so we extend it.
For doing this, put a block in parent template and in where you want to inject the child template. Then in child template, first extend the base template and
then write the block content and then, as children of that block content, put your content of that page.
So in child template and when you say:
block content
  <... content of child template>
you're re-defining the content block of that base file template.
Learn: So by putting the same `block content`, in the overview.pug , we're re-defining that block
Note: Each file can only extend one other file.

So the base.pug is the skeleton that has all the html stuff, but not the specific content for that page.
So this is the opposite of including.

Learn: When a template extends the base template, the base template still has access to the locals(the variables that we passed into the templates that extend that
 base template!).*/
/* 174-8. Setting up the Project Structure:
Just like we did with our resources, I'm also gonna create a router and a controller for the views. So basically a file where I can put all the
routes that we need in order to build our dynamic WEBSITE(UI).
So create viewRoutes.js .

After adding some routes to router in viewRoutes, we need to mount that router to our app.

175-9. Building the Tour Overview - Part 1:
*/
