
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

export const useCanvasDemo = () => {
  const location = useLocation();
  const hasShownDemo = useRef(false);

  useEffect(() => {
    // Check for demo parameter in URL
    const urlParams = new URLSearchParams(location.search);
    const isDemoMode = urlParams.get('demo') === 'true';
    
    // Check if demo was already shown this session
    const demoShownThisSession = sessionStorage.getItem('canvas-demo-shown') === 'true';
    
    if (isDemoMode && !hasShownDemo.current && !demoShownThisSession) {
      // Small delay to ensure the canvas is fully rendered
      setTimeout(() => {
        startDemo();
        hasShownDemo.current = true;
        sessionStorage.setItem('canvas-demo-shown', 'true');
      }, 1000);
    }
  }, [location.search]);

  const startDemo = () => {
    const intro = introJs();
    
    intro.setOptions({
      steps: [
        {
          title: 'Welcome to TaskCanvas! 🎉',
          intro: 'Let me show you around this powerful task management canvas. You can create, organize, and connect your tasks visually.',
          position: 'auto'
        },
        {
          element: '[data-demo="sidebar"]',
          title: 'Sidebar Tools',
          intro: 'This sidebar contains all your tools for managing tasks, applying filters, and accessing templates.',
          position: 'right'
        },
        {
          element: '[data-demo="quick-actions"]',
          title: 'Quick Actions',
          intro: 'Use these quick actions to add tasks, arrange your canvas, apply filters, and more.',
          position: 'right'
        },
        {
          element: '[data-demo="add-task-btn"]',
          title: 'Add New Tasks',
          intro: 'Click here to add a new task to your canvas. You can create tasks, milestones, or notes.',
          position: 'left'
        },
        {
          element: '[data-demo="canvas-controls"]',
          title: 'Canvas Controls',
          intro: 'Use these controls to zoom in/out, fit the view, and add new nodes directly to the canvas.',
          position: 'left'
        },
        {
          element: '.react-flow',
          title: 'The Canvas',
          intro: 'This is your main workspace. Drag to pan around, scroll to zoom, and click on empty space to deselect items.',
          position: 'auto'
        },
        {
          title: 'Get Started! 🚀',
          intro: 'You\'re all set! Try adding your first task or explore the templates to get started quickly.',
          position: 'auto'
        }
      ],
      showProgress: true,
      showBullets: false,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      nextLabel: 'Next →',
      prevLabel: '← Back',
      doneLabel: 'Get Started! 🎯',
      tooltipClass: 'custom-intro-tooltip'
    });

    intro.start();
  };

  return { startDemo };
};
