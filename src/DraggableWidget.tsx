import React , { ReactNode } from 'react';
import { useDrag } from 'react-dnd';
import { Box } from '@chakra-ui/react';

const type = 'DRAGGABLE_ITEM';

interface DraggableWidgetProps {
  title: string; // 타이틀 prop을 추가합니다.
  component: ReactNode; // 여기서 component라는 prop을 추가합니다.
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  title, // title prop을 받아옵니다.
  component,
}) => {
  const [, ref] = useDrag({
    type: type,
    item: {}
  });

  return (
    <Box
      ref={ref}
      w="100%"  // 너비 100%
      h="100%"  // 높이 100%
      bg="white"
      padding="20px"
      boxSizing="border-box"
    > 
        <div className="draggable-widget-title" style={{ height: '50px' }}> {/* 높이 조절 */}
        <h3>{title}</h3>
      </div>
      <div className="draggable-widget" style={{ height: 'calc(100% - 50px)' }}> {/* 높이 조절 */}
        {component}
      </div>
    </Box>
  )
}

export default DraggableWidget;
