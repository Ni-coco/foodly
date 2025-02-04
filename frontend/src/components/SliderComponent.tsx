import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

interface SliderComponentProps {
  marks: { value: number; label: string }[];
  defaultValue: number;
  onChange: (event: Event, value: number | number[]) => void;
}

function valuetext(value: number) {
  return `${value}`;
}

export default function SliderComponent({ marks, defaultValue, onChange }: SliderComponentProps) {
  return (
    <Box className='flex flex-col justify-center items-center' sx={{ width: 400 }}>
      <Slider
        aria-label="Filter Slider"
        defaultValue={defaultValue}
        getAriaValueText={valuetext}
        step={null}
        marks={marks}
        onChange={onChange}
        sx={{
          color: '#006D77',
          '& .MuiSlider-thumb': {
            '&:hover, &.Mui-focusVisible': {
              boxShadow: '0px 0px 0px 8px rgba(0, 109, 119, 0.16)',
            },
            '&.Mui-active': {
              boxShadow: '0px 0px 0px 14px rgba(0, 109, 119, 0.16)',
            },
          },
        }}
      />
    </Box>
  );
}