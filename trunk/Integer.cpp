#include "Carin.h"
#include "Integer.h"

#include "StorageManager.h"
#include "Expression.h"

Integer::Integer()
{
	type = XT_INTEGER;
	value = 0;
	mytext = string("0");
}

Integer::Integer(int n)
{
	type = XT_INTEGER;
	value = n;
	ostringstream outs;
	outs << n;
	mytext = outs.str();
}

 /* Integer(string)
  *
  * by this point we have already verified that
  * the string in "numstring" is a correctly
  * formatted integer -- all that logic is encapsulated
  * in the factory object.  So now we just need to
  * get the value of that int.
  */
Integer::Integer(string numstr)
{
	type = XT_INTEGER;
	mytext = numstr;
	istringstream is(numstr);
	is >> value;
}

Integer::~Integer()
{
}

int Integer::getIntRep()
{
	return value;
}

sPtr Integer::promote()
{
	sPtr p = GSM.newReal(value);
	return p;
}

sPtr Integer::newobj()
{
	return GSM.createExp(new Integer()); 
}

sPtr Integer::copystate(sPtr n) {
	((Integer*)n)->value = value;
	return Number::copystate(n);
}

