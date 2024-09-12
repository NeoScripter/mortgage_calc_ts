export function setupSlidingElement(element: HTMLElement, milliseconds: number = 400) {
    if (!element.parentElement || !element.parentElement.classList.contains('slideUpParent')) {
        const parent = document.createElement('div');
        parent.classList.add('slideUpParent');
        parent.style.display = 'grid';
        parent.style.transition = `grid-template-rows ${milliseconds}ms ease-in-out`;
        element.insertAdjacentElement('afterend', parent);
        parent.appendChild(element);
        parent.querySelector('p')!.style.overflowY = 'hidden';
        parent.style.gridTemplateRows = '1fr'; 
    } 
}

export function slideUp(element: HTMLElement) {
    setupSlidingElement(element);
    const parent = element.parentElement;
    if (parent && parent.classList.contains('slideUpParent')) {
        parent.style.gridTemplateRows = '0fr';
    }
}

export function slideDown(element: HTMLElement) {
    const parent = element.parentElement;
    if (parent && parent.classList.contains('slideUpParent')) {
        parent.style.gridTemplateRows = '1fr';
    }
}


export function fadeOut(element: HTMLElement, milliseconds: number = 400) {
    setTransition(element, milliseconds,'opacity', () => {
        element.style.opacity = '0';
        () => {
            element.style.display = 'none';
        }
    });
}

export function fadeIn(element: HTMLElement, milliseconds: number = 400) {
    setTransition(element, milliseconds, 'opacity', () => {
        element.style.opacity = '1';
        () => {
            element.style.removeProperty('display');
        }
    });
}

export function setTransition(
    element: HTMLElement,
    milliseconds: number,
    property: string,
    callback: Function
) {
    element.style.transition = `${property} ${milliseconds}ms ease-in-out`;
    callback(element);
}

