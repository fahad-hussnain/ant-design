import React, { useState } from 'react';
import QRCode from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render } from '../../../tests/utils';
import type { QRCodeProps } from '../interface';

describe('QRCode test', () => {
  mountTest(QRCode);
  rtlTest(QRCode);

  it('should correct render', () => {
    const { container } = render(<QRCode value="test" />);
    expect(
      container
        ?.querySelector<HTMLDivElement>('.ant-qrcode')
        ?.querySelector<HTMLCanvasElement>('canvas'),
    ).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should render `null` and console Error when value not exist', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<QRCode value={undefined as unknown as string} />);
    expect(container.firstChild).toBe(null);
    expect(container.firstChild).toMatchSnapshot();
    expect(errSpy).toHaveBeenCalledWith('Warning: [antd: QRCode] need to receive `value` props');
    errSpy.mockRestore();
  });

  it('support custom icon', () => {
    const { container } = render(<QRCode value="test" icon="test" />);
    expect(
      container
        ?.querySelector<HTMLDivElement>('.ant-qrcode')
        ?.querySelector<HTMLImageElement>('img'),
    ).toBeTruthy();
  });

  it('support custom size', () => {
    const { container } = render(<QRCode value="test" size={100} />);
    const wapper = container.querySelector<HTMLDivElement>('.ant-qrcode');
    expect(wapper?.style?.width).toBe('100px');
    expect(wapper?.style?.height).toBe('100px');
  });

  it('support refresh', () => {
    const refresh = jest.fn();
    const { container } = render(<QRCode value="test" status="expired" onRefresh={refresh} />);
    fireEvent.click(
      container
        ?.querySelector<HTMLDivElement>('.ant-qrcode')
        ?.querySelector<HTMLButtonElement>('button.ant-btn-link')!,
    );
    expect(refresh).toHaveBeenCalled();
  });

  it('support loading', () => {
    const Demo: React.FC = () => {
      const [status, setStatus] = useState<QRCodeProps['status']>('active');
      return (
        <>
          <QRCode value="test" status={status} />
          <button type="button" onClick={() => setStatus('loading')}>
            set loading
          </button>
        </>
      );
    };
    const { container } = render(<Demo />);
    expect(container.querySelector<HTMLDivElement>('.ant-spin-spinning')).toBeFalsy();
    fireEvent.click(container?.querySelector<HTMLButtonElement>('button')!);
    expect(container.querySelector<HTMLDivElement>('.ant-spin-spinning')).toBeTruthy();
  });

  it('support bordered', () => {
    const { container } = render(<QRCode value="test" bordered={false} />);
    expect(container?.querySelector<HTMLDivElement>('.ant-qrcode')).toHaveClass(
      'ant-qrcode-borderless',
    );
  });
});
