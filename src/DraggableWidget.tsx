import React , { ReactNode } from 'react';
import { useDrag } from 'react-dnd';
import { Box } from '@chakra-ui/react';

const type = 'DRAGGABLE_ITEM';

interface DraggableWidgetProps {
  title: string; // title prop을 추가합니다.
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
      <div className="draggable-widget-title">
        <h3>{title}</h3> {/* title prop의 값을 위젯의 제목으로 표시합니다. */}
      </div>
      <div className="draggable-widget">
        {component}
      </div>
    </Box>
  )
}

export default DraggableWidget;
