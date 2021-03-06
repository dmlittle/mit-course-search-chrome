// Create tooltip variable
var tooltipDOM;
var lastSelection = null;

// Listen to mouseup events to edit/reveal the tooltip information
document.addEventListener('mouseup', function (e) {
    var selection = window.getSelection().toString();

    if (/^\s?([1-9]|[1-2][0-9]|CMS|cms|STS|sts|21[awfhlmAWFHLM])\.([sS]?[\d]{2,3}[xJaAbBcC]?|UAT|UAP)\s?$/.test(selection) && selection != lastSelection) {
  
      // Create tooltip container
      createTooltip();
  
      $.get( "http://student.mit.edu/catalog/search.cgi?search="+selection, function(data) {
        var courseName = $(data).find('blockquote').html();

        // Fix Image Links
        courseName = replaceAll("src=\"/icns", "src=\"http://student.mit.edu/icns", courseName);   

        // Fix Course Links
        courseName = replaceAll("href=\"m", "href=\"http://student.mit.edu/catalog/m", courseName);   
                
        if (courseName.match(/<h3>/g).length == 1) {
           courseName = courseName.substring(courseName.indexOf('<h3>')); //
        } else {
           courseName = courseName.substring(courseName.indexOf('<h3>'), courseName.indexOf('<a name="'));
          };
          
          courseName = courseName + '\n <img alt="______" src="http://student.mit.edu/icns/hr.gif"> <br />';
          courseName = courseName + '\n <a href="https://edu-apps.mit.edu/ose-rpt/subjectEvaluationSearch.htm?search=Search&subjectCode='+selection+'">Subject Evaluations</a>';
          
          var xPos = e.pageX-300 ;
          var yPos = e.pageY;
          var tooltipMargin = 30;
          var tooltipWidth = 600;
          tooltipDOM.style.width = tooltipWidth + 'px';
          var windowWidth = $(window).width();
          var windowOffset = 0;
          
          if (windowWidth < tooltipWidth) {
            tooltipWidth = windowWidth * 0.85 - 2 * tooltipMargin;
            tooltipDOM.style.width = tooltipWidth + 'px' ;
          }

          if (xPos < tooltipMargin) {
            xPos = tooltipMargin;
          } 
          
          if (xPos + tooltipWidth > windowWidth) {
            xPos += (windowWidth - xPos - tooltipWidth) - 2 * tooltipMargin ;      
          }

          var scrolled = $(document).scrollLeft();
          if ( scrolled > 0) {
            xPos += scrolled;
          }
          
                    
        lastSelection = selection;
        if (tooltipDOM.style.visibility == 'visible') {
            changeTooltipText(courseName);
        } else {
            showTooltip(xPos, yPos, courseName);
        }
        clearSelection();
      });
    }
  }, false);


// Hide the tooltip when the the mosue is clicked somewhere outside tooltip
$("body > div:not(.course_tooltip)").click(function(e) {
      if ($('.course_tooltip').length) {
        tooltipDOM.style.visibility = 'hidden';
        lastSelection = null;
      }
});

// Move tooltip to the appropiate location and reveal it
function showTooltip(mouseX, mouseY, selection) {
  tooltipDOM.innerHTML = selection;
  tooltipDOM.style.top = mouseY + 'px';
  tooltipDOM.style.left = mouseX + 'px';
  tooltipDOM.style.visibility = 'visible';
}

function changeTooltipText(selection) {
  tooltipDOM.innerHTML = selection;
}



// Helped Functions...
function createTooltip() {
      if (!$('.course_tooltip').length) {
        // If we haven't already added a tooltip container, add it.
        tooltipDOM = document.createElement('div');
        tooltipDOM.setAttribute('class', 'course_tooltip');
        document.body.appendChild(tooltipDOM);
      }
}


function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function clearSelection() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}