import React from 'react';
import { createUseStyles } from 'react-jss';
import { AiFillPushpin, AiOutlineFolderAdd, AiOutlineHome } from 'react-icons/ai';
import { MdOutlineBlock, MdOutlineEdit, MdWorkOutline } from 'react-icons/md';
import { RiUser3Line } from 'react-icons/ri';
import { IoMdClose } from 'react-icons/io';
import { Colors, ColorsTest, Theme, theme } from '../theme/Theme';
import { BsCheck } from 'react-icons/bs';
import { GiDualityMask, GiKnifeThrust, GiRobber } from 'react-icons/gi';
import classnames from 'classnames';
import { TiWarning } from 'react-icons/ti';
import { ImLink } from 'react-icons/im';

const useStyles = createUseStyles<string, { size: number, color: Colors }, any>((theme: Theme) => ({
  container: {
    ...theme.basicFlex,
    padding: theme.marginBase / 2,
    borderRadius: theme.borderRadius.std,
  },
  active: {
    background: theme.colors.orange,
  },
  icon: props => ({
    fontSize: props.size,
    color: theme.colors[props.color],
    fontWeight: 700,
    [theme.media.mobile]: {
      fontSize: props.size / 1.5,
    },
  }),
}));

export enum Icon {
  home,
  work,
  profile,
  close,
  check,
  pin,
  edit,
  addFolder,
  robber,
  knife,
  block,
  lie,
  warn,
  link
}

interface Props {
  icon: Icon,
  size?: number,
  color?: Colors,
  className?: string,
}

export const Icons = ({ icon, size, color, className }: Props) => {
  const classes = useStyles({ size: size || theme.icon.large, color: color || ColorsTest.lightGray, theme });
  return (
    <>
      {icon === Icon.home && <AiOutlineHome className={classnames(classes.icon, className)} />}
      {icon === Icon.work && <MdWorkOutline className={classnames(classes.icon, className)} />}
      {icon === Icon.profile && <RiUser3Line className={classnames(classes.icon, className)} />}
      {icon === Icon.close && <IoMdClose className={classnames(classes.icon, className)} />}
      {icon === Icon.check && <BsCheck className={classnames(classes.icon, className)} />}
      {icon === Icon.pin && <AiFillPushpin className={classnames(classes.icon, className)} />}
      {icon === Icon.edit && <MdOutlineEdit className={classnames(classes.icon, className)} />}
      {icon === Icon.addFolder && <AiOutlineFolderAdd className={classnames(classes.icon, className)} />}
      {icon === Icon.robber && <GiRobber className={classnames(classes.icon, className)} />}
      {icon === Icon.knife && <GiKnifeThrust className={classnames(classes.icon, className)} />}
      {icon === Icon.block && <MdOutlineBlock className={classnames(classes.icon, className)} />}
      {icon === Icon.lie && <GiDualityMask className={classnames(classes.icon, className)} />}
      {icon === Icon.warn && <TiWarning className={classnames(classes.icon, className)} />}
      {icon === Icon.link && <ImLink className={classnames(classes.icon, className)} />}
    </>
  );
};