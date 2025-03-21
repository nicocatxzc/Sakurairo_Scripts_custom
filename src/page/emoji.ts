export default function prepareEmoji() {
    const emojiPanelButton = document.getElementById('emotion-toggle') as HTMLElement;
    const emojiPanel = document.querySelector('.emotion-box') as HTMLElement;
    const header = document.querySelector('.emotion-header') as HTMLElement;
    const commentTextArea = document.querySelector('.comment-textarea') as HTMLElement;

    if (!emojiPanelButton) {
        document.removeEventListener('click', closeEmojiPanel );
        document.removeEventListener('mousemove', moveDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', moveDrag);
        document.removeEventListener('touchend', endDrag);
        if (header) {
            header.removeEventListener('touchstart', startDrag);
            header.removeEventListener('mousedown', startDrag);
        }
        return
    }

    if (emojiPanelButton) {
        emojiPanelButton.addEventListener('click', openEmoji);
    }

    function openEmoji() {
        if (!emojiPanel) return;
      
        // 判断是否已经拖动过
        const dragged = emojiPanel.getAttribute('dragged');
      
        if (!dragged) {
            const btnRect = emojiPanelButton.getBoundingClientRect();
            const panelWidth = emojiPanel.offsetWidth;
            const panelHeight = emojiPanel.offsetHeight;

            let leftPos = btnRect.left + window.scrollX + (btnRect.width / 2) - (panelWidth / 2);
            const isFixed = window.getComputedStyle(emojiPanel).position === "fixed";
            let topPos = isFixed ? (btnRect.top - panelHeight) : (btnRect.top - panelHeight + window.scrollY);

            emojiPanel.style.left = `${leftPos}px`;
            emojiPanel.style.top = `${topPos}px`;
        }
      
        // 立即呼出
        emojiPanel.classList.toggle('open');
      
        // 初始化拖拽监听器
        if (!emojiPanel.hasAttribute('initialized')) {
            initEmojiPanel();
            emojiPanel.setAttribute('initialized', 'true'); // 标记已初始化
        }
      }

    function initEmojiPanel() {
        if (!emojiPanel || !header) return;
        
        // 监听鼠标事件
        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', moveDrag);
        document.addEventListener('mouseup', endDrag);
        
        // 监听触摸事件
        header.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', moveDrag, { passive: false });
        document.addEventListener('touchend', endDrag);
        
        // 点击外部关闭面板
        if (emojiPanelButton) {
            document.addEventListener('click', closeEmojiPanel );
        }
    }

    // 不处于输入框、表情面板、表情开关时，关闭
    function closeEmojiPanel (e: Event) {
        const target = e.target as Node;
        if (
            !emojiPanel.contains(target) && 
            !emojiPanelButton.contains(target) &&
            !commentTextArea.contains(target) ) 
        {
            emojiPanel.classList.remove('open');
        }
    }

    let offsetX = 0, offsetY = 0, isDragging = false;
      
    function startDrag(e: MouseEvent | TouchEvent) {
        isDragging = true;
        const event = (e as TouchEvent).touches ? (e as TouchEvent).touches[0] : (e as MouseEvent);
        offsetX = event.clientX - emojiPanel.offsetLeft;
        offsetY = event.clientY - emojiPanel.offsetTop;
        emojiPanel.style.transition = "none"; // 拖拽时禁用动画
    
        if ((e as TouchEvent).touches) e.preventDefault();
    }
    
    function moveDrag(e: MouseEvent | TouchEvent) {
        if (!isDragging) return;
        const event = (e as TouchEvent).touches ? (e as TouchEvent).touches[0] : (e as MouseEvent);
        const left = event.clientX - offsetX;
        const top = event.clientY - offsetY;
        emojiPanel.style.left = `${left}px`;
        emojiPanel.style.top = `${top}px`;
        emojiPanel.setAttribute('dragged', 'true'); // 标记为已拖拽
    
        if ((e as TouchEvent).touches) e.preventDefault();
    }
    
    function endDrag() {
        isDragging = false;
        emojiPanel.style.transition = "";
    }

    const row = document.querySelector('.emotion-box>table tr')
    if (!row) return

    //表情栏切换
    row.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).tagName === 'TH') {
            for (const element of row.querySelectorAll('th')) {
                const container = document.querySelector<HTMLElement>(`.${element.className.match(/(\S+)-bar/)[1]}-container`)
                if (element === e.target) {
                    element.classList.add('on-hover')
                    container.style.display = 'block'
                } else {
                    element.classList.remove('on-hover')
                    container.style.display = 'none'
                }
            }
        }
    })
}
