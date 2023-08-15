import React , { ReactNode } from 'react';
import { useDrag } from 'react-dnd';
import { Box } from '@chakra-ui/react';


const type = 'DRAGGABLE_ITEM';

interface DraggableWidgetProps {
  initialWidth?: number;
  initialHeight?: number;
  component: ReactNode; // 여기서 component라는 prop을 추가합니다.
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  component, 
  initialWidth = 200,
  initialHeight = 200
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
      bg="lightgray"
      padding="20px"
      boxSizing="border-box"
    > 
    {component}

    </Box>
  )
}

export default DraggableWidget;
